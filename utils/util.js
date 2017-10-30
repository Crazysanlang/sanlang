var app = getApp();

/**
 * 延迟加载-等待获取openid
 * flag: true-跳转，false-打开新窗口
 */
function loginAuth() {
  setTimeout(function () {
    if (!app.globalData.isWxLoginComplete) {
      loginAuth()
      return;
    }
    var that = this;
    wx.request({
      url: app.globalData.server + '/user/wxLogin',
      data: { open_id: app.globalData.open_id, js_code: app.globalData.js_code },
      method: 'POST',
      header: { "content-type": "application/x-www-form-urlencoded" },
      success: function (res) {
        console.log("用户登录返回的code:" + res.data.code)
        app.globalData.isLoginCode = res.data.code
        // if (!res.data.success) {
        //   if (flag)
        //     wx.redirectTo({ url: '../../pages/user/login' })
        //   else
        //     wx.navigateTo({ url: '../../pages/user/login' })
        // }
      },
      fail: function (res) {
        console.log("登录失败：" + res)
      }
    })
  }, 300);
}

// 校验手机号
function checkMobile(mobile) {
  if (isEmpty(mobile))
    return false;
  var reg = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
  return reg.test(mobile);
}
// 判断是否是数字
function isNumber(num) {
  if (isEmpty(num))
    return false;
  if (!isNaN(num)) return true;
  else return false;
}
// 判断字符串是否为空
function isEmpty(value) {
  if (typeof (value) == "undefined" || value == 'undefined' || value == null)
    return true;
  value = (value + '').replace(/(^\s+)|(\s+$)/g, "");
  if (value == '')
    return true;
  return false;
}
// 是否是有效的验证码
function isCodeFlag(code) {
  if (isEmpty(code) || code.length < 6)
    return false;
  return isNumber(code);
}
// 是否有效的密码
function isPwdFlag(password) {
  if (isEmpty(password) || password.length < 6)
    return false;
  // var reg = /^[0-9a-zA-Z]+$/;
  // if (!reg.test(password))
  //   return false;
  return true;
}
// 提示
function alert(message) {
  wx.showModal({
    title: '系统提示',
    content: message,
    showCancel: false
  })
}
// 显示loading
function showLoading() {
  if (wx.showLoading) {
    wx.showLoading({ title: '加载中', mask: true })
  }
}
// 隐藏loading
function hideLoading() {
  if (wx.hideLoading) {
    wx.hideLoading()
  }
}
// 获取经纬度
function getLocation() {
  // console.log("--- 获取经纬度 ---")
  wx.getLocation({
    type: 'wgs84',
    success: function (res) {
      app.globalData.latitude = res.latitude
      app.globalData.longitude = res.longitude
    }
  })
}
/**
 * url:相对地址
 * data:请求参数
 * method:默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
 * success:返回成功函数
 * fail:返回错误函数
 */
function httpReq(url, data, method, success, fail) {
  // showLoading()
  var mydata = data || {};
  if (isEmpty(method)) method = "POST";
  wx.request({
    url: app.globalData.server + url,
    data: data,
    method: method,
    header: { "content-type": "application/x-www-form-urlencoded" },
    success: success,
    fail: fail,
    complete: function () {
      // hideLoading()
    }
  })
}
function showCountDown(leftTime) {
  if (leftTime <= 0)
    return "00:00:00";
  var hh = parseInt(leftTime / 1000 / 60 / 60 % 24, 10);
  var mm = parseInt(leftTime / 1000 / 60 % 60, 10);
  var ss = parseInt(leftTime / 1000 % 60, 10);
  hh = checkTime(hh);
  mm = checkTime(mm);
  ss = checkTime(ss);
  return hh + ":" + mm + ":" + ss;
}
function checkTime(i) {
  if (i < 10) i = "0" + i;
  return i;
}
// 当前日期
function getNowFormatDate() {
  var date = new Date();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9)
    month = "0" + month;
  if (strDate >= 0 && strDate <= 9)
    strDate = "0" + strDate;
  var currentdate = date.getFullYear() + "-" + month + "-" + strDate;
  return currentdate;
}
// 格式化千分位小数
function formatMoney(s, n) {
  n = n > 0 && n <= 20 ? n : 2;
  s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
  var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
  var t = "";
  for (var i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
  }
  return t.split("").reverse().join("") + "." + r;
}
// 提示alert并返回到上一级页面
function alertToBack(message) {
  wx.showModal({
    title: '系统提示',
    content: message,
    showCancel: false,
    success: function () {
      wx.navigateBack();
    }
  })
}
// 公用跳转业务
function loginAuthToLogin(code) {
  // 登录
  if (code == app.globalData.loginCode_1125 || code == app.globalData.loginCode_9999) {
    wx.navigateTo({ url: '/pages/user/login' })
    return true;
  }
  // 用户已冻结
  else if (code == app.globalData.loginCode_1144) {
    alert("该用户已冻结")
    return true;
  }
  // 会员已冻结
  else if (code == app.globalData.loginCode_1139) {
    alert("该会员已冻结")
    return true;
  }
  // 未认证会员
  else if (code == app.globalData.loginCode_1147 || code == app.globalData.loginCode_1138) {
    wx.navigateTo({ url: '/pages/user/auth' })
    return true;
  }
  return false;
}
// 身份证校验
function isCardNo(card) {
  var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (reg.test(card) === false) {
    return false;
  }
  return true;
}
// 获取时间
function getDateFormat(dayNum) {
  var dd = new Date();
  dd.setDate(dd.getDate() + dayNum);
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1;
  if (m < 10) m = "0" + m;
  var d = dd.getDate();
  if (d < 10) d = "0" + d;
  return y + "-" + m + "-" + d;
}

function encodeChar(data)
{
   return encodeURIComponent(data);
}
function decodeChar(data)
{
    return decodeURI(data);
}

// 定义
module.exports = {
  loginAuth: loginAuth,
  checkMobile: checkMobile,
  isEmpty: isEmpty,
  alert: alert,
  isNumber: isNumber,
  isCodeFlag: isCodeFlag,
  isPwdFlag: isPwdFlag,
  httpReq: httpReq,
  showLoading: showLoading,
  hideLoading: hideLoading,
  getLocation: getLocation,
  showCountDown: showCountDown,
  getNowFormatDate: getNowFormatDate,
  formatMoney: formatMoney,
  alertToBack: alertToBack,
  loginAuthToLogin: loginAuthToLogin,
  isCardNo: isCardNo,
  getDateFormat: getDateFormat,
  encodeChar:encodeChar,
  decodeChar:decodeChar
}
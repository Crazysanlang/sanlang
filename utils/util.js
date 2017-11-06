var app = getApp();

// 页面跳转业务
function toPageFlag() {
  var flag = false;
  // 已登录
  if (app.globalData.loginFlag) {
    var applyMember = app.globalData.applyMember;
    if (applyMember == -1) {
      wx.navigateTo({ url: '/pages/user/auth?skipAuth=true' })
      flag = true;
    }
    else if (applyMember == 2) {
      alert('您的会员申请正在审核中，请耐心等待');
      flag = true;
    }
  }
  else {
    wx.navigateTo({ url: '/pages/user/login' })
    flag = true;
  }
  return flag;
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
  var params = data || {};
  if (isEmpty(method)) method = "POST";
  wx.request({
    url: app.globalData.server + url,
    data: params,
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

function encodeChar(data) {
  return encodeURIComponent(data);
}
function decodeChar(data) {
  return decodeURI(data);
}

function setStorageSync(sessionId) {
  try {
    wx.setStorageSync(app.globalData.storageSessionId, sessionId)
  } catch (e) {
    alert("无法缓存您的回话状态，请检查手机存储空间")
  }
}

function getStorageSync() {
  var value = '';
  try {
    value = wx.getStorageSync(app.globalData.storageSessionId)
  } catch (e) {
    alert("获取回话状态有误，请检查手机存储空间")
  }
  return value;
}

function setLoginStatus(value) {
  app.globalData.loginFlag = true;
  app.globalData.sessionId = value;
  // 用户身份认证信息
  userIdentity();
}

// 用户身份认证信息
function userIdentity() {
  if (!app.globalData.loginFlag)
    return;
  httpReq("/user/userIdentity", { sessionId: app.globalData.sessionId }, "POST",
    function (result) {
      var data = result.data;
      if (!data.success)
        return;
      var entity = data.entity;
      if (entity == null)
        return;
      app.globalData.tradingEligibility = entity.tradingEligibility;
      app.globalData.auctionQualification = entity.auctionQualification;
      app.globalData.applyMember = entity.applyMember;
    },
    function (result) { });
}

// 根据粮食等级id获取粮食等级
function levelStr(level) {
  if (level == 1)
    return '一等品';
  else if (level == 2)
    return '二等品';
  else if (level == 3)
    return '三等品';
  else if (level == 4)
    return '四等品';
  else if (level == 5)
    return '五等品';
  return '未知';
}

//扩展Date的format方法   
Date.prototype.format = function (format) {
  var o = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S": this.getMilliseconds()
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
}

function getFormatDate(date, pattern) {
  if (date == undefined) {
    date = new Date();
  }
  if (pattern == undefined) {
    pattern = "yyyy-MM-dd hh:mm:ss";
  }
  return date.format(pattern);
}

function getSmpFormatDateByLong(time, pattern) {
  return getFormatDate(new Date(time), pattern);
}

// 拨打电话
function makePhoneCall(phone) {
  wx.makePhoneCall({ phoneNumber: phone })
}

// 打开文档
function openDocument(key) {
  showLoading();
  wx.downloadFile({
    url: app.globalData.server + '/file/public/read?type=2&key=' + key,
    success: function (res) {
      // wx.showToast({ title: '文档下载成功', icon: 'success', duration: 1500 })
      var filePath = res.tempFilePath
      wx.openDocument({
        filePath: filePath,
        success: function (res) {
        },
        fail: function (e) {
          alert('该文档无法打开');
          console.log(e)
        },
        complete: function () {
          hideLoading();
        }
      })
    },
    fail: function (e) {
      alert('下载文件失败');
    },
    complete: function () {
      hideLoading();
    }
  })
}

// 获取图片
function getImageInfo(key) {
  var path = '';
  wx.getImageInfo({
    src: app.globalData.server + '/file/public/read?type=1&key=' + key,
    success: function (res) {
      path = res.path;
    }
  })
  return path;
}

// 定义
module.exports = {
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
  isCardNo: isCardNo,
  getDateFormat: getDateFormat,
  encodeChar: encodeChar,
  decodeChar: decodeChar,
  setStorageSync: setStorageSync,
  getStorageSync: getStorageSync,
  setLoginStatus: setLoginStatus,
  levelStr: levelStr,
  getSmpFormatDateByLong: getSmpFormatDateByLong,
  makePhoneCall: makePhoneCall,
  openDocument: openDocument,
  getImageInfo: getImageInfo,
  toPageFlag: toPageFlag,
  userIdentity: userIdentity
}
var app = getApp()
var util = require('../../utils/util.js')

Page({
  data:
  {
    mobileValue: "",
    pwdValue: "",
    btnDisabled: true,
    btnLoading: false
  },
  onLoad: function (options) { },
  onReady: function () {

  },
  onShow: function () { },
  onHide: function () { },
  onUnload: function () { },
  // 手机号bind
  bind_mobile_input: function (e) {
    this.setData({ mobileValue: e.detail.value })
    this.checkBtn()
  },
  // 密码bind
  bind_pwd_input: function (e) {
    this.setData({ pwdValue: e.detail.value })
    this.checkBtn()
  },
  checkBtn: function () {
    var mobileValue = this.data.mobileValue;
    var pwdValue = this.data.pwdValue;
    if (mobileValue.length > 0 || pwdValue.length > 0) {
      this.setData({ btnDisabled: false })
    }
    else {
      this.setData({ btnDisabled: true })
    }
  },
  toReg: function () {
    wx.navigateTo({ url: 'reg' })
  },
  login: function () {
    var mobileFlag = util.checkMobile(this.data.mobileValue);
    if (!mobileFlag) {
      util.alert("手机号格式有误，请重新输入");
      return;
    }
    var pwdFlag = util.isPwdFlag(this.data.pwdValue);
    if (!pwdFlag) {
      util.alert("密码格式有误，请重新输入");
      return;
    }
    // 调用注册
    var params = {
      mobile: this.data.mobileValue,
      password: this.data.pwdValue,
      open_id: app.globalData.open_id
    };
    util.httpReq("/user/login", params, "POST",
      function (result) {
        var data = result.data
        app.globalData.isLoginCode = data.code;
        if (data.success) {
          wx.navigateBack()
        }
        else {
          util.alert(data.message);
        }
      },
      function (result) {
        util.alert(app.globalData.failMsg);
      })
  },
  // 忘记密码
  toFindPwd: function(e){
    wx.navigateTo({ url: '/pages/userCenter/account/findPwd' })
  }
})

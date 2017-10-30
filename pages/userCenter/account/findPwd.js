var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: 
  { 
    mobileValue: "",
    codeValue: "",
    pwdValue: "",
    pwd1Value: '',
    mobileDisabled: false,
    sendMsgBtnDisabled: true,
    sendMsgTxt: '发送验证码',
    btnDisabled: true,
    btnLoading: false,
    regadmin_countdown_time: 60

  },
  onLoad:function(options) { 
  },
  // 手机号bind
  bind_mobile_input: function (e) {
    this.setData({ mobileValue: e.detail.value })
    this.checkBtn()
  },
  // 验证码bind
  bind_code_input: function (e) {
    this.setData({ codeValue: e.detail.value })
    this.checkBtn()
  },
  // 密码bind
  bind_pwd_input: function (e) {
    this.setData({ pwdValue: e.detail.value })
    this.checkBtn()
  },
  // 密码bind
  bind_pwd1_input: function (e) {
    this.setData({ pwd1Value: e.detail.value })
    this.checkBtn()
  },
  // 校验
  checkBtn: function () {
    var mobileValue = this.data.mobileValue;
    var codeValue = this.data.codeValue;
    var pwdValue = this.data.pwdValue;
    if (mobileValue.length > 0 || codeValue.length > 0 || pwdValue.length > 0) {
      this.setData({ btnDisabled: false })
    }
    else {
      this.setData({ btnDisabled: true })
    }
    var mobileFlag = util.checkMobile(mobileValue);
    if (mobileFlag && (this.data.regadmin_countdown_time == 60)) {
      this.setData({ sendMsgBtnDisabled: false })
    }
    else {
      this.setData({ sendMsgBtnDisabled: true })
    }
  },
  // 发送验证码
  bindSendMessage: function (e) {
    var that = this;
    var mobileFlag = util.checkMobile(this.data.mobileValue)
    if (!mobileFlag) {
      util.alert("手机号码有误");
      return;
    }
    // 发送短信
    var mydata = { mobile: this.data.mobileValue, js_code: app.globalData.js_code };
    util.httpReq("/reg/sendResetPasswordSMS", mydata, "POST",
      function (result) {
        var data = result.data
        if (data.success) {
          that.setData({ sendMsgBtnDisabled: true })
          that.sendMobileCountDown()
        }
        else {
          if (data.code == 8004) {
            var lastTime = parseInt(data.entity);
            that.setData({ sendMsgBtnDisabled: true, regadmin_countdown_time: lastTime });
            that.sendMobileCountDown();
          }
          util.alert(data.message);
        }
      },
      function (result) {
        util.alert(app.globalData.failMsg);
      })
  },
  // 60秒倒计时
  sendMobileCountDown: function () {
    var that = this
    // 60秒倒计时
    if (this.data.sendMsgBtnDisabled) {
      this.data.regadmin_countdown_time--;
      var sendMsgDown = "已发送(" + this.data.regadmin_countdown_time + ")";
      that.setData({
        mobileDisabled: true,
        sendMsgTxt: sendMsgDown,
        sendMsgBtnDisabled: true
      })
      setTimeout(function () { that.sendMobileCountDown() }, 1000)
    }
    else {
      that.setData({
        mobileDisabled: false,
        sendMsgTxt: '发送验证码',
        sendMsgBtnDisabled: false
      })
    }
    if (this.data.regadmin_countdown_time <= 1) {
      that.setData({
        regadmin_countdown_time: 60,
        sendMsgBtnDisabled: false
      })
    }
  },
  // 找回密码
  resetPassword: function (e) {
    var mobileFlag = util.checkMobile(this.data.mobileValue);
    if (!mobileFlag) {
      util.alert("手机号格式有误");
      return;
    }
    var codeFlag = util.isCodeFlag(this.data.codeValue);
    if (!codeFlag) {
      util.alert("验证码格式有误");
      return;
    }
    var pwdFlag = util.isPwdFlag(this.data.pwdValue);
    if (!pwdFlag) {
      util.alert("密码格式有误");
      return;
    }
    var pwd1Flag = util.isPwdFlag(this.data.pwd1Value);
    if (pwdFlag != pwd1Flag) {
      util.alert("2次密码输入不一致");
      return;
    }

    // 调用注册
    var params = {
      js_code: app.globalData.js_code,
      verCode: this.data.codeValue,
      password: this.data.pwdValue,
      open_id: app.globalData.open_id
    };
    util.httpReq("/reg/resetPassword.do", params, "POST",
      function (result) {
        var data = result.data
        if (data.success) {
          util.alertToBack("重置密码成功");
        }
        else {
          util.alert(data.message);
        }
      },
      function (result) {
        util.alert(app.globalData.failMsg);
      })
  },






})

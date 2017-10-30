var app = getApp()
var util = require('../../utils/util.js')

Page({
  data: {
    mobileValue: "",
    codeValue: "",
    pwdValue: "",
    mobileDisabled: false,
    sendMsgBtnDisabled: true,
    sendMsgTxt: '发送验证码',
    btnDisabled: true,
    btnLoading: false,
    regadmin_countdown_time: 60,
    nameValue: ''
  },
  // 姓名bind
  bind_name_input: function (e) {
    this.setData({ nameValue: e.detail.value })
    this.checkBtn()
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
  // 校验
  checkBtn: function () {
    var name = this.data.nameValue;
    var mobileValue = this.data.mobileValue;
    var codeValue = this.data.codeValue;
    var pwdValue = this.data.pwdValue;
    if (name.length > 0 || mobileValue.length > 0 || codeValue.length > 0 || pwdValue.length > 0) {
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
  // 注册
  bindRegTap: function (e) {
    var name = this.data.nameValue;
    if (util.isEmpty(name)) {
      util.alert("请输入姓名");
      return;
    }
    var mobileFlag = util.checkMobile(this.data.mobileValue);
    if (!mobileFlag) {
      util.alert("请输入正确的手机号");
      return;
    }
    var codeFlag = util.isCodeFlag(this.data.codeValue);
    if (!codeFlag) {
      util.alert("请输入正确验证码");
      return;
    }
    var pwdFlag = util.isPwdFlag(this.data.pwdValue);
    if (!pwdFlag) {
      util.alert("请输入6-16位字母或数字");
      return;
    }
    // 调用注册
    var params = {
      js_code: app.globalData.js_code,
      open_id: app.globalData.open_id,
      vCode: this.data.codeValue,
      password: this.data.pwdValue,
      name: name
    };
    util.httpReq("/reg/bindAccount.do", params, "POST",
      function (result) {
        var data = result.data
        if (data.success) {
          wx.redirectTo({ url: 'auth' })
        }
        else {
          util.alert(data.message);
        }
      },
      function (result) {
        util.alert(app.globalData.failMsg);
      })
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
    util.httpReq("/reg/sendMessage.do", mydata, "POST",
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
  // 用户协议
  openDocument: function(){
    var pic = this.data.pic;
    util.showLoading();
    wx.downloadFile({
      url: app.globalData.server + '/api/getImage?key=reg/agree.pdf',
      success: function (res) {
        var filePath = res.tempFilePath;
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
          },
          fail: function(res){
            util.alert('当前系统无法打开该文件');
          },
          complete: function(){
            util.hideLoading();
          }
        })
      }
    })
  }
})

var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: 
  { 
    pwdValue: '',
    newPwdValue: '',
    newPwd1Value: ''
  },
  onLoad:function(options) { 
  },
  onReady:function() {
  },
  pwdBind: function(e){
    this.setData({ pwdValue:e.detail.value })
  },
  newPwdBind: function(e){
    this.setData({ newPwdValue:e.detail.value })
  },
  newPwd1Bind: function(e){
    this.setData({ newPwd1Value:e.detail.value })
  },
  modifyPassword: function(e){
    var oldPassword = this.data.pwdValue;
    if (!util.isPwdFlag(oldPassword)){
      util.alert('原密码格式有误');
      return;
    }
    var newPassword = this.data.newPwdValue;
    if (!util.isPwdFlag(newPassword)){
      util.alert('新密码格式有误');
      return;
    }
    var newPassword1 = this.data.newPwd1Value;
    if (newPassword != newPassword1){
      util.alert('2次密码输入不一致');
      return;
    }

    var params = { oldPassword: oldPassword, newPassword: newPassword, open_id: app.globalData.open_id }; 
    util.httpReq("/user/modifyPassword", params, "POST",
      function (result) {
        var data = result.data
        if (data.success) {
          util.alertToBack("修改成功");
        }
        else {
          util.alert(data.message);
        }
      },
      function (result) {
        util.alert(app.globalData.failMsg);
      })
  }
  
})

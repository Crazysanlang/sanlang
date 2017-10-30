var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: 
  { 
    userInfo:{},
    taxCertValue: '',
    phoneValue: '',
    openBankValue: '',
    bankAccountValue: '',
    addressValue: ''
  },
  onLoad:function(options) { 
  },
  onReady: function () {
    this.userInfoAjax()
  },
  // 获取用户信息
  userInfoAjax: function(){
    var that = this
    var params = { open_id: app.globalData.open_id };
    util.httpReq("/user/userInfo", params, "POST",
      function (res) {
        var data = res.data;
        if (data.success) {
          var entity = data.entity;
          if (entity != null){
             that.setData({ userInfo: entity, taxCertValue:entity.member.taxCert, phoneValue:entity.member.phone, openBankValue:entity.member.openBank, bankAccountValue:entity.member.bankAccount, addressValue:entity.member.address  })
          }
        }
        else{
          if (util.loginAuthToLogin(data.code)) 
            return;
          util.alert(data.message);
        }
      },
      function (res) {
        util.alert(app.globalData.failMsg);
      });
  },
  taxCertBind: function(e){
    this.setData({ taxCertValue: e.detail.value })
  },
  phoneBind: function(e){
    this.setData({ phoneValue: e.detail.value })
  },
  openBankBind: function(e){
    this.setData({ openBankValue: e.detail.value })
  },
  bankAccountBind: function(e){
    this.setData({ bankAccountValue: e.detail.value })
  },
  addressBind: function(e){
    this.setData({ addressValue: e.detail.value })
  },
  // 更新企业信息
  updateMember: function(e){
    var taxCert = this.data.taxCertValue;
    var phone = this.data.phoneValue;
    var address = this.data.addressValue;
    var openBank = this.data.openBankValue;
    var bankAccount = this.data.bankAccountValue;
    var memberInfo = this.data.userInfo.member;
    if (memberInfo == null)
    {
      util.alertToBack('网络异常，请稍后再试');
      return;
    }
    memberInfo.phone = phone;
    memberInfo.address = address;
    memberInfo.taxCert = taxCert;
    memberInfo.openBank = openBank;
    memberInfo.bankAccount = bankAccount;

    var params = { open_id: app.globalData.open_id, memberInfo:JSON.stringify(memberInfo) };
    util.httpReq("/user/updateMember", params, "POST",
      function (result) {
        var data = result.data
        if (data.success) {
          util.alertToBack("修改成功");
        }
        else 
        {
          if (util.loginAuthToLogin(data.code)) 
            return;
          util.alert(data.message);
        }
      },
      function (result) {
        util.alert(app.globalData.failMsg);
      })
  }
})

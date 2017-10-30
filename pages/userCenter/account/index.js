var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: {
    isMember: false
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function(e){
    this.userInfoAjax()
  },
  // 退出登录
  logout: function (e) {
    var params = { open_id: app.globalData.open_id };
    util.httpReq("/user/logout", params, "POST",
      function (res) {
        var data = res.data;
        if (data.success) {
          wx.showToast({
            title: '退出成功',
            icon: 'success',
            duration: 1000,
            mask: true,
            success: function(){
              setTimeout(function () {
                wx.navigateBack()
              }, 1000)
            }
          })
        }
        else {
          util.alert(data.message);
        }
      },
      function (res) {
        util.alert(app.globalData.failMsg);
      });
  },
  // 个人信息修改
  toUserInfo: function(e){
    wx.navigateTo({ url: 'userInfo' })
  },
  // 公司信息修改
  toCompanyInfo: function(e){
    wx.navigateTo({ url: 'companyInfo' })
  },
  // 修改密码
  toEditPwd: function(e){
    wx.navigateTo({ url: 'editPwd' })
  },
  // 开票信息
  toTicketInfo: function(e){
    wx.navigateTo({ url: 'ticketInfo' })
  },
  // 企业认证
  toAuth: function(e){
    wx.navigateTo({ url: '/pages/user/auth?skipAuth=false' })
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
          if (entity == null){
            that.setData({ isMember: false })
          }
          else{
            var member = entity.member;
            if (member == null){
              that.setData({ isMember: false })
            }
            else{
              that.setData({ isMember: true })
            }
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
  }
})
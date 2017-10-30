var app = getApp()
var util = require('../../utils/util.js')

Page({
  data: {
    firstDataFlag: true,
    items: [],
    isLoginFlag: false
  },
  onLoad: function (options) { 
  },
  onReady: function () {
  },
  onShow:function(e){
    this.ajaxList();
    this.isLoginAuth()
  },
  // 推荐资源
  ajaxList: function () {
    var that = this;
    var params = { pageNum: 1, pageSize: 6, open_id: app.globalData.open_id };
    util.httpReq("/listing/getListingList", params, "POST",
      function (result) {
        var data = result.data
        if (data.success) {
          var entity = data.entity;
          console.log(entity)
          that.setData({ items: entity.list })
        }
        else {
          util.alert(data.message);
        }
        that.setData({ firstDataFlag: false })
      },
      function (result) {
        util.alert(app.globalData.failMsg);
      })
  },
  // 去详情
  cottonDetail: function (e) {
    var batchID = e.currentTarget.id;
    wx.navigateTo({ url: '../shop/batchDetail?batchID=' + batchID })
  },
  // 去扫码
  toScanCode: function () {
    wx.scanCode({
      success: (res) => {
        var code = res.result;
        if (util.isEmpty(code) || code.length < 13)
        {
          util.alert("获取扫码内容有误，请重新扫码");
          return;
        }
        var batchID = code.substring(2, 13);
        wx.navigateTo({ url: "/pages/shop/batchDetail?batchID=" + batchID })
      }
    })
  },
  // 去商城
  toShopList: function (e){
    wx.switchTab({ url: '/pages/shop/list' })
  },
  // 搜索批次
  toShopSearch: function(e){
    wx.navigateTo({ url: '/pages/shop/search' })
  },
  // 我要卖
  toListingIn: function(e){
    if (this.data.isLoginFlag)
      wx.navigateTo({ url: '/pages/userCenter/seller/listingIn' })
    else
      wx.navigateTo({ url: '/pages/user/login' })
  },
  // 购物车
  toShopping: function (e) {
    if (this.data.isLoginFlag)
      wx.navigateTo({ url: '/pages/shop/shopping' })
    else
      wx.navigateTo({ url: '/pages/user/login' })
  },
  // 分享页面
  onShareAppMessage: function () {
    return {
      title: '棉联+',
      path: '/pages/index/index',
      success: function(res) {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 1500
        })
      }
    }
  },
  isLoginAuth: function() {
    var that = this
    util.showLoading()
    setTimeout(function () {
      if (!app.globalData.isWxLoginComplete) {
        that.isLoginAuth()
        return;
      }
      var params = { open_id: app.globalData.open_id, js_code: app.globalData.js_code };
      util.httpReq("/user/wxLogin", params, "POST",
        function (res) {
          var data = res.data;
          app.globalData.isLoginCode = data.code
          if (data.success) 
          {
            that.setData({ isLoginFlag:true })
          }
          else
          {
            that.setData({ isLoginFlag:false })
          }
          util.hideLoading()
        },
        function (res) {
          util.alert(app.globalData.failMsg);
          util.hideLoading()
        });
    }, 300);
  },
  // 融资贷
  toFinanceApply: function(e){
    if (this.data.isLoginFlag)
      wx.navigateTo({ url: '/pages/finance/apply' })
    else
      wx.navigateTo({ url: '/pages/user/login' })
  },
  // 质押贷
  toPledgeApply: function(e){
    if (this.data.isLoginFlag)
      wx.navigateTo({ url: '/pages/pledge/apply' })
    else
      wx.navigateTo({ url: '/pages/user/login' })
  },
  // 拍储首页
  toAuction: function(e){
    wx.switchTab({ url: '/pages/auction/list' })
  }
})

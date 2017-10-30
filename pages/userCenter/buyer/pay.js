var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: {
    items: [],
    firstDataFlag: true,
    windowHeight: 0
  },
  onLoad: function (options) { 
  },
  onReady: function () {
    this.setData({ windowHeight: app.globalData.windowHeight })
  },
  onShow: function(){
    this.orderListAjax()
  },
  orderListAjax: function(){
    var that = this;
    that.setData({ firstDataFlag: true })
    var params = { open_id: app.globalData.open_id, buySell:1, status:2 };
    util.httpReq("/trade/getOrderList", params, "POST",
      function (result) {
        var data = result.data
        if (data.success) {
          var entity = data.entity;
          that.setData({ items: entity.list })
        }
        else {
          if (util.loginAuthToLogin(data.code)) 
            return;
          util.alert(data.message);
        }
        that.setData({ firstDataFlag: false })
      },
      function (result) {
        util.alert(app.globalData.failMsg);
      })
  },
  // 付款
  toPayIn: function(e){
    var orderID = e.currentTarget.id;
    var money = e.currentTarget.dataset.money;
    wx.navigateTo({ url: 'payIn?addFlag=' + true + '&orderID=' + orderID + "&money=" + money })
  },
})

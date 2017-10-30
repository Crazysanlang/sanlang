var app = getApp()
var util = require('../../utils/util.js')

Page({
  data: {
    orderID: '',
    buySell: 0
  },
  onLoad: function (options) { 
    this.setData({ orderID: options.id })
  },
  onReady: function () {
    this.loginWait()
  },
  loginWait: function(){
    var that = this;
    setTimeout(function () {
      if (!app.globalData.isWxLoginComplete) {
        that.loginWait()
        return;
      }
      that.orderDetailAjax()
    }, 300);
  },
  // 判断订单是买家还是卖家
  orderDetailAjax: function(){
    var that = this;
    var params = { open_id: app.globalData.open_id, orderID: this.data.orderID };
    util.httpReq("/trade/getOrderIndex", params, "POST",
      function (result) {
        var data = result.data
        if (data.success) {
          var entity = data.entity;
          var buySell = entity.buySell;
          if (!util.isEmpty(buySell)){
            that.setData({ buySell:buySell })
          }
        }
        else {
          if (util.loginAuthToLogin(data.code)) 
            return;
          util.alert(data.message);
        }
      },
      function (result) {
        util.alert(app.globalData.failMsg);
      })
  },
  toOrderDetail: function(e){
    var buySell = this.data.buySell;
    if (buySell == 1)
      wx.navigateTo({ url: '/pages/userCenter/buyer/orderDetail?orderID=' + this.data.orderID })
    else if (buySell == 2)
      wx.navigateTo({ url: '/pages/userCenter/seller/orderDetail?orderID=' + this.data.orderID })
    else
      util.alert('您无权访问该订单')
  },
  toIndex: function(e){
    wx.switchTab({ url: '/pages/index/index' })
  },
  toUserCenter: function(e){
    wx.switchTab({ url: '/pages/userCenter/index' })
  }
})

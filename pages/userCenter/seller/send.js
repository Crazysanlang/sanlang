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
    try {
        var res = wx.getSystemInfoSync()
        this.setData({ windowHeight: (res.windowHeight-56) })
    } catch (e) {}
  },
  onShow: function(){
    this.orderListAjax()
  },
  orderListAjax: function(){
    var that = this;
    that.setData({ firstDataFlag: true })
    var params = { open_id: app.globalData.open_id, buySell:2, status:0 };
    util.httpReq("/trade/getOrderList", params, "POST",
      function (result) {
        var data = result.data
        if (data.success) {
          var _items = [];
          var entity = data.entity;
          var list = entity.list;
          if (list != null && list.length > 0){
            for(var i=0;i<list.length;i++){
              var needDeliveryAmount = list[i].needDeliveryAmount;
              if (needDeliveryAmount > 0)
                _items.push(list[i]);
            }
          }
          that.setData({ items: _items })
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
  // 发货
  toSendIn: function(e){
    var orderID = e.currentTarget.id;
    wx.navigateTo({ url: 'sendIn?orderID=' + orderID })
  }
})

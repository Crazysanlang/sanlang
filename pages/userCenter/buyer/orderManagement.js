var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: 
  { 
    orderID: '',
    itemDetail: {},
    buySell: 0,
    itemsList0: [],
    itemsList1: [],
    itemsList2: [],
    itemsList3: [],
    itemsList4: [],
  },
  onLoad:function(options) {
    this.setData({ orderID: options.orderID, buySell: options.buySell })
  },
  onShow: function () { 
    this.orderDetailAjax()
    this.orderProgress()
  },
  orderDetailAjax: function(){
    var that = this;
    var params = { open_id: app.globalData.open_id, orderID: this.data.orderID };
    util.httpReq("/trade/getOrder", params, "POST",
      function (result) {
        var data = result.data
        if (data.success) {
          var entity = data.entity;
          entity.needInvoiceMoneyFmt = util.formatMoney(entity.needInvoiceMoney, 2);
          that.setData({ itemDetail: data.entity })
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
  // 订单执行过程
  orderProgress:function(){
    var that = this;
    var params = { open_id: app.globalData.open_id, orderID: this.data.orderID, buySell:this.data.buySell };
    util.httpReq("/trade/getOrderProgress", params, "POST",
      function (result) {
        var data = result.data
        if (data.success) {
          var entity = data.entity;
          if (entity != null && entity.length > 0){
            var itemsList0 = [];
            var itemsList1 = [];
            var itemsList2 = [];
            var itemsList3 = [];
            var itemsList4 = [];
            for (var i = 0; i < entity.length; i++){
              entity[i].money = util.formatMoney(entity[i].money, 2);

              var _type = entity[i].type;
              if (_type == 0) itemsList0.push(entity[i])
              else if (_type == 1) itemsList1.push(entity[i])
              else if (_type == 2) itemsList2.push(entity[i])
              else if (_type == 3) itemsList3.push(entity[i])
              else if (_type == 4) itemsList4.push(entity[i])
            }
            that.setData({ itemsList0: itemsList0, itemsList1:itemsList1, itemsList2:itemsList2, itemsList3:itemsList3, itemsList4:itemsList4 })
          }
        }
        else {
          util.alert(data.message);
        }
      },
      function (result) {
        util.alert(app.globalData.failMsg);
      })
  },
  // 上传合同
  toContract: function(e){
    var pic = e.currentTarget.dataset.pic;
    wx.navigateTo({ url: 'contract?orderID=' + this.data.orderID + '&pic=' + pic})
  }
})

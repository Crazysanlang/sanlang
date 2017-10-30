var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: 
  { 
    orderID: '',
    itemDetail: {},
    itemsList: []
  },
  onLoad:function(options) { 
    this.setData({ orderID: options.orderID})
  },
  onReady: function () { 
    // this.orderDetailAjax()
    // this.orderProgress()
  },
  onShow: function(){
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
    var params = { open_id: app.globalData.open_id, orderID: this.data.orderID, buySell:2 };
    util.httpReq("/trade/getOrderProgress", params, "POST",
      function (result) {
        var data = result.data
        if (data.success) {
          var entity = data.entity;
          if (entity != null && entity.length > 0){
            var itemsList = [];
            for (var i = 0; i < entity.length; i++){

              var _type = entity[i].type;
              var _status = entity[i].status;
              if (_type == 0){
                if (_status == 2 || _status == 9)
                  entity[i].type = 9; // 订单已经关闭状态
              }
              else{
                if (_status != 1)
                  continue;
              }

              entity[i].procDate = entity[i].procDate.substring(5);
              entity[i].money = util.formatMoney(entity[i].money, 2);
              itemsList.push(entity[i]);
            }
            that.setData({ itemsList: itemsList })
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
  toOrderManagerment: function (e){
    var status = e.currentTarget.dataset.status;
    if (status == 0 || status == 1 || status == 4 || status == 5 || status == 6 || status == 7 || status == 8)
      wx.navigateTo({ url: '/pages/userCenter/buyer/orderManagement?orderID=' + e.currentTarget.id + "&buySell=2" })
  },
  toBatchDetail: function(e){
    wx.navigateTo({ url: '/pages/shop/batchDetail?batchID=' + e.currentTarget.id + '&bottomFlag=false' })
  },
  // 收款列表
  toCheques: function (e){
    wx.navigateTo({ url: 'cheques?orderID=' + this.data.orderID + '&status=1' })
  },
  // 发货
  toSendIn: function (e){
    wx.navigateTo({ url: 'sendIn?orderID=' + this.data.orderID })
  },
  // 开票
  toBillingIn: function (e){
    var money = this.data.itemDetail.needInvoiceMoney;
    var amount = this.data.itemDetail.needInvoiceAmount;
    wx.navigateTo({ url: 'billingIn?orderID=' + this.data.orderID + "&money=" + money + "&amount=" + amount })
  },
  // 联系买家
  toContacts: function(e){
    app.globalData.contactsItem = this.data.itemDetail;
    wx.navigateTo({ url: 'userDetail' })
  },
  // 上传合同
  toContract: function(e){
    var pic = e.currentTarget.dataset.pic;
    wx.navigateTo({ url: '/pages/userCenter/buyer/contract?orderID=' + this.data.orderID + '&pic=' + pic})
  }
})

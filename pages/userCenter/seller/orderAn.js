var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: 
  { 
    orderID: '',
    itemDetail: {},
    amountSum: 0,
    priceSum: '0.00',
    deliveryModePlaceholder: '请选择提货方式',
    deliveryModeObjArray: [],
    deliveryModeIndex: '',
    deliveryModeId: '',
    lastDepositDateValue: '请选择定金最后支付日期',
    lastPaymentDateValue: '请选择最后提货日',
    depositValue: 0,
    checkboxIds: []
  },
  onLoad:function(options) {
    this.setData({ orderID: options.orderID})
  },
  onReady: function () { 
    this.orderDetailAjax()
    this.deliveryTypeListAjax()
  },
  onShow: function(){
    var itemDetail = app.globalData.orderInItemDetail;
    if (itemDetail != ''){
      this.setData({ itemDetail: itemDetail })
      this.checkboxAction()
    }
  },
  orderDetailAjax: function(){
    var that = this;
    var params = { open_id: app.globalData.open_id, orderID: this.data.orderID };
    util.httpReq("/trade/getOrder", params, "POST",
      function (result) {
        var data = result.data
        if (data.success) {
          var entity = data.entity;
          if (entity == null) return;
          var list = entity.list;
          if (list == null) return;

          var checkboxIds = [];
          var amountSum = 0;
          var priceSum = 0;
          for (var i = 0; i < list.length; i++){
            amountSum += list[i].amount;
            priceSum += (list[i].price*list[i].amount);
            checkboxIds.push(list[i].detailID)
          }
          app.globalData.orderInItemDetail = data.entity;
          that.setData({ itemDetail: data.entity, amountSum:amountSum, priceSum: util.formatMoney(priceSum, 2), checkboxIds:checkboxIds })
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
  // 配送方式列表
  deliveryTypeListAjax: function () {
    var that = this;
    util.httpReq("/bases/getDeliveryTypeList", "", "POST",
      function (result) {
        var data = result.data;
        if (data.success) {
          var entity = data.entity;
          that.setData({ deliveryModeObjArray: entity });
        }
        else {
          util.alert(data.message);
        }
      },
      function (result) {
        util.alert(app.globalData.failMsg);
      })
  },
  // 定金金额绑定
  bindDeposit: function(e){
    this.setData({ depositValue: e.detail.value })
  },
  // 提货方式选择
  bindDeliveryModeChange:function(e){
    var index = e.detail.value;
    var value = this.data.deliveryModeObjArray[index].deliveryType;
    this.setData({ deliveryModeId: value, deliveryModeIndex: index, deliveryModePlaceholder: '' });
  },
  // 最后支付日期选择
  lastDepositDateBind: function(e){
    this.setData({ lastDepositDateValue: e.detail.value })
  },
  // 最后付款日期选择
  lastPaymentDateBind: function(e){
    this.setData({ lastPaymentDateValue: e.detail.value })
  },
  // checkbox改变
  checkboxChange: function(e){
    this.setData({checkboxIds: e.detail.value})
    this.checkboxAction()
  },
  checkboxAction: function(){
    var entity = this.data.itemDetail
    if (entity == null) return;
    var list = entity.list;
    if (list == null || list.length <= 0) return;
    var ids = this.data.checkboxIds;
    var amountSum = 0;
    var priceSum = 0;
    for (var z = 0; z < ids.length; z++){
      for (var i = 0; i < list.length; i++){
        if (ids[z] == list[i].detailID)
        {
          var amount = parseFloat(list[i].amount);
          amountSum += amount;
          priceSum += (list[i].price*amount);
        }
      }
    }
    this.setData({ amountSum:amountSum, priceSum: util.formatMoney(priceSum, 2) })
  },
  // 修改价格
  toChangeBatch: function(e){
    wx.navigateTo({ url: 'changeBatch?detailID=' + e.currentTarget.id })
  },
  // 确认提交
  confirmOrder: function(e){
    var depositValue = this.data.depositValue;
    if (!util.isNumber(depositValue) || depositValue <= 0)
    {
      util.alert("请输入有效的定金金额");
      return;
    }
    var lastDepositDateValue = this.data.lastDepositDateValue;
    if (util.isEmpty(lastDepositDateValue) || lastDepositDateValue == '请选择定金最后支付日期')
    {
      util.alert("请选择定金最后支付日期");
      return;
    }
    var deliveryModeId = this.data.deliveryModeId;
    if (util.isEmpty(deliveryModeId)){
      util.alert("请选择提货方式");
      return;
    }
    var lastPaymentDateValue = this.data.lastPaymentDateValue;
    if (util.isEmpty(lastPaymentDateValue) || lastPaymentDateValue == '请选择最后提货日')
    {
      util.alert("请选择最后提货日");
      return;
    }
    var checkboxIds = this.data.checkboxIds;
    if (checkboxIds == null || checkboxIds.length <= 0){
      util.alert("请最少选择一个批号");
      return;
    }

    var details = [];
    var itemDetail = app.globalData.orderInItemDetail;
    if (itemDetail != null){
      var list = itemDetail.list;
      for(var i=0;i<list.length;i++){
        var detail = {};
        detail.detailID = list[i].detailID;
        detail.amountType = list[i].amountType;
        detail.amount = list[i].amount;
        detail.price = list[i].price;
        detail.depotID = list[i].depotID;
        detail.batchID = list[i].batchID;
        details.push(detail)
      }
    }

    var orderID = this.data.orderID;
    var params = { open_id: app.globalData.open_id, orderID: orderID, deliveryMode:deliveryModeId, deposit:depositValue, lastDepositDate:lastDepositDateValue, lastPaymentDate:lastPaymentDateValue, details:JSON.stringify(details) };
    util.httpReq("/trade/confirmOrder", params, "POST",
      function (result) {
        var data = result.data
        if (data.success) {
          util.alertToBack("订单确认成功");
          // wx.redirectTo({ url: 'orderDetail?orderID=' + orderID })
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
  },
  // 联系买家
  toContacts: function(e){
    app.globalData.contactsItem = this.data.itemDetail;
    wx.navigateTo({ url: 'userDetail' })
  }
})

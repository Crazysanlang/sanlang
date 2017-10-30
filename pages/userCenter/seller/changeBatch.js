var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data:
  {
    detailID: '',
    batchID: '',
    amountTypeObjArray: [{ id: 0, name: '公重' }, { id: 1, name: '毛重' }, { id: 2, name: '净重' }],
    amountTypeIndex: 0,
    amountValue: '',
    priceValue: '',
    depotID: '',
    depotName: ''
  },
  onLoad: function (options) {
    var detailID = options.detailID;
    var itemDetail = app.globalData.orderInItemDetail;
    if (itemDetail != null){
      var listItem = {};
      var list = itemDetail.list;
      for(var i=0;i<list.length;i++){
        if (detailID != list[i].detailID) 
          continue;
        listItem = list[i];
      }
      this.setData({ detailID: detailID, batchID: listItem.batchID, depotID: listItem.depotID, amountValue: listItem.amount, priceValue: listItem.price, amountTypeIndex: listItem.amountType })
      wx.setNavigationBarTitle({ title: listItem.batchID })
    }
  },
  onReady: function () {
    this.getDepotName();
  },
  onShow: function (){
    var depotID = app.globalData.baseDepotID;
    if (!util.isEmpty(depotID)) {
      var corpName = app.globalData.baseCorpName;
      this.setData({ depotID: depotID, depotName: corpName })
      app.globalData.baseDepotID = '';
      app.globalData.baseCorpName = '';
    }
  },
  // 结算方式选择
  amountTypeChange: function (e) {
    var index = e.detail.value;
    // var value = this.data.amountTypeObjArray[index].name;
    this.setData({ amountTypeIndex: index });
  },
  // 重量绑定
  amountValueBind: function (e) {
    this.setData({ amountValue: e.detail.value })
  },
  // 价格绑定
  priceValueBind: function (e) {
    this.setData({ priceValue: e.detail.value })
  },
  // 选择仓库
  selectDepotPage: function (e) {
    wx.navigateTo({ url: '/pages/store/list' })
  },
  // 确认修改
  toOrderAn: function (e) {
    var amountValue = this.data.amountValue;
    if (!util.isNumber(amountValue) || amountValue <= 0) {
      util.alert("请输入有效的重量");
      return;
    }

    var priceValue = this.data.priceValue;
    if (!util.isNumber(priceValue) || priceValue <= 0) {
      util.alert("请输入有效的单价");
      return;
    }

    var depotID = this.data.depotID;
    if (util.isEmpty(depotID)) {
      util.alert("请选择仓库");
      return;
    }

    var detailID = this.data.detailID;
    var itemDetail = app.globalData.orderInItemDetail;
    if (itemDetail != null){
      var list = itemDetail.list;
      for(var i=0;i<list.length;i++){
        if (detailID != list[i].detailID)
          continue;
        list[i].amount = amountValue;
        list[i].price = priceValue;
        list[i].amountType = this.data.amountTypeIndex;
        list[i].depotID = this.data.depotID;
      }
      app.globalData.orderInItemDetail = itemDetail;
    }
    wx.navigateBack();
  },
  getDepotName: function(){
    var that = this;
    var params = { open_id: app.globalData.open_id, depotID: this.data.depotID };
    util.httpReq("/bases/getDepot", params, "POST",
      function (result) {
        var data = result.data
        if (data.success) {
          that.setData({ depotName:data.entity.corpName })
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
  }

})

var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: 
  { 
    listingID: '',
    itemDetail: {},

    amountTypeObjArray: [{ id: 0, name: '公重' }, { id: 1, name: '毛重' }, { id: 2, name: '净重' }],
    amountTypeIndex: '',
    amountId: '',

    priceValue: 0,

    depotID: '',
    corpName: '请选择仓库'
  },
  onLoad:function(options) { 
    this.setData({ listingID: options.listingID})
  },
  onReady: function () { 
    this.listingAjax()
  },
  onShow: function () { 
    var depotID = app.globalData.baseDepotID;
    if (!util.isEmpty(depotID)) {
      var corpName = app.globalData.baseCorpName;
      this.setData({ depotID: depotID, corpName: corpName })
      app.globalData.baseDepotID = '';
      app.globalData.baseCorpName = '';
    }
  },
  listingAjax: function(){
    var that = this;
    var params = { open_id: app.globalData.open_id, listingID: this.data.listingID };
    util.httpReq("/trade/getListing", params, "POST",
      function (result) {
        var data = result.data
        if (data.success) {
          var entity = data.entity;
          that.setData({ itemDetail: entity, depotID: entity.depotID, corpName: entity.depotName, amountTypeIndex:entity.amountType, amountId: entity.amountType, priceValue: entity.price })
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
  // 价格绑定
  bindPrice: function (e) {
    this.setData({ priceValue: e.detail.value })
  },
  // 结算方式选择
  amountTypeChange: function (e) {
    var index = e.detail.value;
    var value = this.data.amountTypeObjArray[index].id;
    this.setData({ amountTypeIndex: index, amountId: value });
  },
  // 选择仓库
  selectDepotPage: function (e) {
    var status = e.currentTarget.id;
    if (status == 0)
      wx.navigateTo({ url: '/pages/store/list' })
  },
  // 确认修改
  updateListing: function (e){
    var priceValue = this.data.priceValue;
    if (!util.isNumber(priceValue) || priceValue <= 0)
    {
      util.alert("请输入有效的挂牌价格");
      return;
    }
    var amountId = this.data.amountId;
    if (util.isEmpty(amountId + "")){
      util.alert("请选择结算方式");
      return;
    }
    var depotID = this.data.depotID;
    if (util.isEmpty(depotID)){
      util.alert("请选择仓库");
      return;
    }
    
    var listingID = this.data.listingID;
    var batchID = e.currentTarget.id
    
    var that = this;
    var params = { open_id: app.globalData.open_id, price:priceValue, batchID:batchID, depotID:depotID, amountType: amountId, listingID:listingID };
    util.httpReq("/trade/updateListing", params, "POST",
      function (res) {
        var data = res.data;
        if (data.success) {
          wx.navigateBack()
        }
        else {
          if (util.loginAuthToLogin(data.code))
            return;
          util.alert(data.message);
        }
      },
      function (res) {
        util.alert(app.globalData.failMsg);
      });
  },
  // 撤销
  revokeListing: function(e){
    var that = this;
    wx.showModal({
      title: '系统提示',
      content: '确定撤销该挂牌信息吗？',
      success: function(res) {
        if (res.confirm) {
          var params = { open_id: app.globalData.open_id, listingID: that.data.listingID };
          util.httpReq("/trade/revokeListing", params, "POST",
            function (res) {
              var data = res.data;
              if (data.success) {
                util.alertToBack("撤销成功");
              }
              else {
                if (util.loginAuthToLogin(data.code))
                  return;
                util.alert(data.message);
              }
            },
            function (res) {
              util.alert(app.globalData.failMsg);
            });
        }
      }
    })
  }
})

var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data:
  {
    phxqlist1_view: true,
    phxqlist2_view: true,
    makeListingDisabled: true,
    batchID: '',
    cottonBatchBean: {},
    priceValue: 0,

    amountTypePlaceholder: '请选择结算方式',
    amountTypeObjArray: [{ id: 0, name: '公重' }, { id: 1, name: '毛重' }],
    amountTypeIndex: '',
    amountId: '',

    depotID: '',
    corpName: '请选择仓库'
  },
  onLoad: function (options) {
    
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
  // 批号输入
  bindBatchID: function (e) {
    var batchID = e.detail.value;
    this.setData({ batchID: batchID })
    if (!util.isEmpty(batchID) && batchID.length == 11)
      this.getCottonBatch();
    else
      this.setData({ cottonBatchBean: {}, phxqlist1_view: true, phxqlist2_view: true, makeListingDisabled: true })
  },
  getCottonBatch: function () {
    var that = this;
    var params = { batchID: this.data.batchID, open_id: app.globalData.open_id };
    util.httpReq("/product/getCottonBatch", params, "POST",
      function (res) {
        var data = res.data;
        if (data.success) {
          var entity = data.entity;
          if (entity == null) {
            that.setData({ cottonBatchBean: {}, phxqlist1_view: false, phxqlist2_view: true, makeListingDisabled: true })
            return;
          }
          that.setData({ cottonBatchBean: entity, depotID: entity.depotID, corpName: entity.depotName, phxqlist1_view: true, phxqlist2_view: false, makeListingDisabled: false })
        }
        else {
          if (util.loginAuthToLogin(data.code))
            return;
          that.setData({ cottonBatchBean: {}, phxqlist1_view: false, phxqlist2_view: true, makeListingDisabled: true })
        }
      },
      function (res) {
        util.alert(app.globalData.failMsg);
      });
  },
  // 价格绑定
  bindPrice: function (e) {
    this.setData({ priceValue: e.detail.value })
  },
  // 结算方式选择
  amountTypeChange: function (e) {
    var index = e.detail.value;
    var value = this.data.amountTypeObjArray[index].id;
    this.setData({ amountTypeIndex: index, amountId: value, amountTypePlaceholder: '' });
  },
  // 选择仓库
  selectDepotPage: function (e) {
    wx.navigateTo({ url: '/pages/store/list' })
  },
  // 挂牌
  makeListing: function (e) {
    var cottonBatchBean = this.data.cottonBatchBean;
    if (cottonBatchBean == null) {
      util.alert("请输入有效的批号");
      return;
    }
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

    var that = this;
    var params = { open_id: app.globalData.open_id, price:priceValue, batchID:this.data.batchID, depotID:depotID, amountType: amountId };
    util.httpReq("/trade/makeListing", params, "POST",
      function (res) {
        var data = res.data;
        if (data.success) {
          wx.redirectTo({ url: 'listingSuc' })
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
})

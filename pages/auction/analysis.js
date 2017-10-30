var app = getApp()
var util = require('../../utils/util.js')

Page({
  data: 
  { 
    baleCode: '',
    firstDataFlag: true,
    items: [],
    itemDetail: {},
    windowHeight: 0
  },
  onLoad:function(options) {
    this.setData({ baleCode:options.baleCode })
  },
  onShow:function() { 
  },
  onReady: function(){
    this.setData({ windowHeight: app.globalData.windowHeight })
    this.cottonBundleAjax()
  },
  cottonBundleAjax: function(e){
    var that = this;
    var params = { open_id: app.globalData.open_id, baleCode: this.data.baleCode };
    util.httpReq("/product/getCottonBundle", params, "POST",
      function (result) {
        var data = result.data
        if (data.success) {
          var list = data.entity;
          that.setData({ itemDetail:list })
        }
        that.listCottonBatch()
      },
      function (result) {
        util.alert(app.globalData.failMsg);
      })
  },
  listCottonBatch: function () {
    var that = this;
    var params = { open_id: app.globalData.open_id, baleCode: this.data.baleCode };
    util.httpReq("/product/listCottonBatchBean", params, "POST",
      function (result) {
        var data = result.data
        if (data.success) {
          that.setData({ items: data.entity })
        }
        that.setData({ firstDataFlag: false })
      },
      function (result) {
        util.alert(app.globalData.failMsg);
      })
  },
  // 去详情
  cottonDetail: function (e) {
    wx.navigateTo({ url: '/pages/shop/batchDetail?batchID=' + e.currentTarget.id })
  },
  // 拍储申请
  toApply: function(e){
    wx.navigateTo({ url: 'apply?baleCode=' + this.data.baleCode })
  }

})

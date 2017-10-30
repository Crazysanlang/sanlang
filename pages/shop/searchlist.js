var app = getApp()
var util = require('../../utils/util.js')

Page({
  data: {
    firstDataFlag: true,
    items: [],
    pageNum: 1,
    moreFlag: false,
    windowHeight: 0,
    depotID: '',
    factoryID: ''
  },
  onLoad: function (options) {
    var depotID = options.depotID;
    if (!util.isEmpty(depotID))
      this.setData({ depotID:depotID })
    var factoryID = options.factoryID;
    if (!util.isEmpty(factoryID))
      this.setData({ factoryID:factoryID })
  },
  onReady: function () {
    var that = this;
    try {
      var res = wx.getSystemInfoSync()
      that.setData({ windowHeight: res.windowHeight });
    } catch (e) { }
    this.ajaxList();
  },
  // 推荐资源
  ajaxList: function () {
    var pageNum = this.data.pageNum;
    if (pageNum == 1)
      this.setData({ firstDataFlag: true })
    this.setData({ moreFlag: false })
    var that = this;
    var params = { pageNum: pageNum, open_id: app.globalData.open_id };
    var depotID = this.data.depotID;
    if (!util.isEmpty(depotID))
      params.depotID = depotID;
    var factoryID = this.data.factoryID;
    if (!util.isEmpty(factoryID))
      params.factoryID = factoryID;

    util.httpReq("/product/searchCottonBatchList", params, "POST",
      function (result) {
        var data = result.data
        if (data.success) {
          var entity = data.entity;
          var totalPage = entity.totalPage;
          // 总页数大于当前页，则有更多按钮
          if (totalPage > pageNum)
            that.setData({ moreFlag: true })
          var list = entity.list;
          if (pageNum == 1)
            that.setData({ items: list })
          else
            that.setData({ items: that.data.items.concat(list) }) // 添加列表元素
        }
        else {
          util.alert(data.message);
        }
        that.setData({ firstDataFlag: false })
        wx.stopPullDownRefresh();
      },
      function (result) {
        util.alert(app.globalData.failMsg);
      })
  },
  // 去详情
  cottonDetail: function (e) {
    wx.navigateTo({ url: '../shop/batchDetail?batchID=' + e.currentTarget.id })
  },
  // 更多
  moreList: function () {
    var pageNum = this.data.pageNum;
    this.setData({ pageNum: pageNum + 1 })
    this.ajaxList()
  }
})
var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: {
    items: [],
    firstDataFlag: true,
    pageNum: 1,
    moreFlag: false,
    windowHeight: 0
  },
  onLoad: function (options) { },
  onReady: function () {
    this.setData({ windowHeight: app.globalData.windowHeight })
  },
  onShow: function(){
    this.paymentList()
  },
  // 付款列表
  paymentList: function () {
    var pageNum = this.data.pageNum;
    if (pageNum == 1)
      this.setData({ firstDataFlag: true })
    this.setData({ moreFlag: false })
    var that = this;
    var params = { pageNum: pageNum, open_id: app.globalData.open_id, buySell:1};
    util.httpReq("/finance/getPaymentList", params, "POST",
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
          if (util.loginAuthToLogin(data.code)) 
            return;
          util.alert(data.message);
        }
        that.setData({ firstDataFlag: false })
        wx.stopPullDownRefresh();
      },
      function (result) {
        util.alert(app.globalData.failMsg);
      })
  },
  // 更多
  moreList: function () {
    var pageNum = this.data.pageNum;
    this.setData({ pageNum: pageNum + 1 })
    this.paymentList()
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({ pageNum: 1 })
    this.paymentList()
  },
  // 付款详情
  toPayDetail: function(e){
    wx.navigateTo({ url: 'payDetail?paymentID=' + e.currentTarget.id })
  }
})

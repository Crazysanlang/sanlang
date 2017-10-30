var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: {
    items: [],
    firstDataFlag: true,
    pageNum: 1,
    moreFlag: false,
    orderID: '',
    status: 0
  },
  onLoad: function (options) { 
    var orderID = options.orderID;
    if (!util.isEmpty(orderID)){
      this.setData({ orderID:orderID, status:options.status })
    }
  },
  onReady: function () {
    // this.deliveryList()
  },
  onShow: function () {
    this.deliveryList()
  },
  // 付款列表
  deliveryList: function () {
    var pageNum = this.data.pageNum;
    if (pageNum == 1)
      this.setData({ firstDataFlag: true })
    this.setData({ moreFlag: false })
    var that = this;
    var params = { pageNum: pageNum, open_id: app.globalData.open_id, buySell:1 };
    var orderID = this.data.orderID;
    if (!util.isEmpty(orderID)){
      params.key = orderID;
      params.status = this.data.status;
    }
    util.httpReq("/trade/getDeliveryList", params, "POST",
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
    this.deliveryList()
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({ pageNum: 1 })
    this.deliveryList()
  },
  // 发货确认
  toDelivery: function(e){
    wx.navigateTo({ url: 'receipt?deliveryID=' + e.currentTarget.id })
  }
})

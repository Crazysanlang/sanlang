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
  onShow: function () {
    this.paymentList()
  },
  // 收款列表
  paymentList: function () {
    var pageNum = this.data.pageNum;
    if (pageNum == 1)
      this.setData({ firstDataFlag: true })
    this.setData({ moreFlag: false })
    var that = this;
    var params = { pageNum: pageNum, open_id: app.globalData.open_id, buySell:2 };
    var orderID = this.data.orderID;
    if (!util.isEmpty(orderID)){
      params.key = orderID;
      params.status = this.data.status;
    }
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
  toChequesDetail: function(e){
    wx.navigateTo({ url: 'chequesDetail?paymentID=' + e.currentTarget.id })
  }
})

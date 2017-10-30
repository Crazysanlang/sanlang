var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data:
  {
    class_tab_hover_0: 'tab_hover',
    class_tab_hover_1: '',
    class_tab_hover_2: '',
    class_tab_hover_8: '',
    class_tab_hover_9: '',

    status: 0,
    items: [],
    firstDataFlag: true,
    pageNum: 1,
    moreFlag: false,
    windowHeight: 0
  },
  onLoad: function (options) {
    this.setData({ windowHeight: app.globalData.windowHeight })
  },
  onReady: function () {
    // this.listingListAjax()
  },
  onShow: function () {
    this.setData({ pageNum:1 })
    this.listingListAjax()
  },
  bindStatus: function (e) {
    this.setData({ class_tab_hover_0: '', class_tab_hover_1: '', class_tab_hover_2: '', class_tab_hover_8: '', class_tab_hover_9: '', pageNum:1 })
    var status = e.currentTarget.dataset.status
    if (status == 0)
      this.setData({ class_tab_hover_0: 'tab_hover' })
    else if (status == 1)
      this.setData({ class_tab_hover_1: 'tab_hover' })
    else if (status == 2)
      this.setData({ class_tab_hover_2: 'tab_hover' })
    else if (status == 8)
      this.setData({ class_tab_hover_8: 'tab_hover' })
    else if (status == 9)
      this.setData({ class_tab_hover_9: 'tab_hover' })

    this.setData({ status: status })
    this.listingListAjax()
  },
  listingListAjax: function () {
    var that = this;
    var pageNum = this.data.pageNum;
    if (pageNum == 1)
      this.setData({ firstDataFlag: true })
    this.setData({ moreFlag: false })
    var params = { open_id: app.globalData.open_id, status: this.data.status, pageNum: this.data.pageNum };
    util.httpReq("/trade/getListingList", params, "POST",
      function (result) {
        var data = result.data
        if (data.success) {
          var entity = data.entity;
          var totalPage = entity.totalPage;
          // 总页数大于当前页，则有更多按钮
          if (totalPage > pageNum)
            that.setData({ moreFlag: true })
          var list = entity.list;
          for (var i = 0; i < list.length; i++) {
            var amount = list[i].amount;
            var price = list[i].price;
            list[i].moneySum = util.formatMoney(amount * price, 2);
          }
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
      },
      function (result) {
        util.alert(app.globalData.failMsg);
      })
  },
  // 更多
  moreList: function () {
    var pageNum = this.data.pageNum;
    this.setData({ pageNum: pageNum + 1 })
    this.listingListAjax()
  },
  // 跳转订单详情
  toListingDetail: function (e) {
    wx.navigateTo({ url: 'listingDetail?listingID=' + e.currentTarget.id })
  }
})

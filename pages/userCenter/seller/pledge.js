var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: {
    items: [],
    firstDataFlag: true,
    pageNum: 1,
    moreFlag: false
  },
  onLoad: function (options) { 
    
  },
  onReady: function () {

  },
  onShow: function () {
    this.loanList()
  },
  // 融资列表
  loanList: function () {
    var pageNum = this.data.pageNum;
    if (pageNum == 1)
      this.setData({ firstDataFlag: true })
    this.setData({ moreFlag: false })
    var that = this;
    var params = { pageNum: pageNum, open_id: app.globalData.open_id, buySell:2 };
    util.httpReq("/trade/getLoanList", params, "POST",
      function (result) {
        var data = result.data
        if (data.success) {
          var entity = data.entity;
          var totalPage = entity.totalPage;
          // 总页数大于当前页，则有更多按钮
          if (totalPage > pageNum)
            that.setData({ moreFlag: true })
          var list = entity.list;
          for(var i=0;i<list.length;i++){
            list[i].loanMoneyFmt = util.formatMoney(list[i].loanMoney, 2);
            list[i].interestFmt = util.formatMoney(list[i].interest, 2);
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
    this.loanList()
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({ pageNum: 1 })
    this.loanList()
  },
  // 详情
  toPledgeDetail: function(e){
    var loanID = e.currentTarget.id;
    var list = this.data.items;
    if (list != null && list.length > 0)
    {
      var itemsDetail = {};
      for(var i=0;i<list.length;i++){
        if (loanID != list[i].loanID)
          continue;
        itemsDetail = list[i];
      }
      app.globalData.loanBeanItem = itemsDetail;
    }
    wx.navigateTo({ url: 'financeDetail' })
  }
})

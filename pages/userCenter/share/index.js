var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data:
  {
    userID: 0,
    memberID: 0,
    nickName: '',
    name: '',
    mobile: '',
    memberItem: {},
    items: [],
    firstDataFlag: true,
    pageNum: 1,
    moreFlag: false,
    windowHeight: 0,
    totalRow: 0
  },
  onLoad: function (options) {
    var userID = options.userID;
    var nickName = options.nickName;
    var memberID = options.memberID;
    var name = options.name;
    var mobile = options.mobile;
    this.setData({ userID: userID, windowHeight: app.globalData.windowHeight, nickName: nickName, memberID: memberID, name: name, mobile: mobile })
    wx.setNavigationBarTitle({ title: nickName + '的资源单' })
  },
  onReady: function () {
    this.setData({ pageNum: 1 })
    this.listingListAjax()
    this.getMember(this.data.memberID)
  },
  onShow: function () {

  },
  listingListAjax: function () {
    var that = this;
    var pageNum = this.data.pageNum;
    if (pageNum == 1)
      this.setData({ firstDataFlag: true })
    this.setData({ moreFlag: false })

    var params = { open_id: app.globalData.open_id, pageNum: this.data.pageNum, userID: this.data.userID };
    util.httpReq("/listing/getListingList", params, "POST",
      function (result) {
        var data = result.data
        if (data.success) {
          var entity = data.entity;
          that.setData({ totalRow: entity.totalRow })
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
  // 获取企业信息
  getMember: function (memberID) {
    var that = this
    var params = { open_id: app.globalData.open_id, memberID: memberID };
    util.httpReq("/bases/getMember", params, "POST",
      function (res) {
        var data = res.data;
        if (data.success) {
          that.setData({ memberItem: data.entity })
        }
        util.hideLoading()
      },
      function (res) {
        util.hideLoading()
      });
  },
  // 跳转订单详情
  cottonDetail: function (e) {
    wx.navigateTo({ url: '/pages/shop/batchDetail?batchID=' + e.currentTarget.id })
  },
  // 拨打电话
  makePhoneCall: function (e) {
    wx.makePhoneCall({ phoneNumber: this.data.mobile })
  },
  // 分享
  onShareAppMessage: function () {
    var userID = this.data.userID;
    var memberID = this.data.memberID;
    var nickName = decodeURIComponent(this.data.nickName);
    var name = decodeURIComponent(this.data.name);
    var mobile = this.data.mobile;
    return {
      title: nickName + '的资源单',
      path: '/pages/userCenter/share/index?userID=' + userID + '&nickName=' + nickName + '&memberID=' + memberID + '&name=' + name + '&mobile=' + mobile,
      success: function (res) {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 1500
        })
      }
    }
  }

})

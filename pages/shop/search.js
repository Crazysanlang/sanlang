var app = getApp()
var util = require('../../utils/util.js')

Page({
  data:
  {
    windowHeight: 0,
    firstHistoryFlag: true,
    firstDataFlag: true,
    items: [],
    searchName: '',
  },
  onLoad: function (options) {

  },
  onReady: function () {
    this.setData({ windowHeight: app.globalData.windowHeight })
    
    var list = this.getStorageHistory()
    if (list != null && list.length > 0)
      this.setData({ items: list })
    else
      this.setData({ items: [], firstHistoryFlag: false, firstDataFlag: true })
  },
  // 获取历史记录
  getStorageHistory: function () {
    var list = [];
    try {
      var value = wx.getStorageSync('storage_history_search')
      if (value) list = value;
    } catch (e) {
      return [];
    }
    return list;
  },
  // 联想搜索
  searchList: function (e) {
    var value = e.detail.value;
    if (util.isEmpty(value)) {
      var list = this.getStorageHistory()
      if (list != null && list.length > 0)
        this.setData({ items: list })
      else
        this.setData({ items: [], firstHistoryFlag: false, firstDataFlag: true })
      return;
    }

    var that = this
    if (util.isNumber(value)) {
      var params = { open_id: app.globalData.open_id, batchID: value };
      util.httpReq("/product/getCottonSearch", params, "POST",
        function (result) {
          var data = result.data
          var list = data.entity;
          if (list != null && list.length > 0) {
            for (var i = 0; i < list.length; i++) {
              list[i].status = list[i].status;
              list[i].id = list[i].id;
              list[i].name = list[i].id;
            }
            that.setData({ items: list })
          }
          else {
            that.setData({ items: [] })
          }
          that.setData({ firstDataFlag: false, firstHistoryFlag: true })
        },
        function (result) {
          that.setData({ items: [], firstDataFlag: false })
        })
    }
    else {
      // 仓库/工厂
      var params = { open_id: app.globalData.open_id, name: value };
      util.httpReq("/bases/getDFList", params, "POST",
        function (result) {
          var data = result.data
          var list = data.entity;
          if (list != null && list.length > 0) {
            that.setData({ items: list })
          }
          else {
            that.setData({ items: [] })
          }
          that.setData({ firstDataFlag: false, firstHistoryFlag: true })
        },
        function (result) {
          util.alert(app.globalData.failMsg);
        })
    }
  },
  // 跳转详情逻辑
  toDetail: function (e) {
    var id = e.currentTarget.id;
    var name = e.currentTarget.dataset.name;
    var status = e.currentTarget.dataset.status;
    var key = "s_" + status + "_id_" + id;
    this.setData({ searchName: '' })

    var itemDetail = {};
    itemDetail.id = id;
    itemDetail.name = name;
    itemDetail.status = status;
    var _tempList = [];
    var list = this.getStorageHistory();
    for (var i = 0; i < list.length; i++) {
      var _key = "s_" + list[i].status + "_id_" + list[i].id;
      if (_key != key)
        _tempList.push(list[i])
    }
    _tempList.unshift(itemDetail);
    if (_tempList != null && _tempList.length > 10)
      _tempList.pop()

    try {
      wx.setStorageSync('storage_history_search', _tempList)
    } catch (e) {
      console.log(e)
    }
    this.setData({ items: _tempList })

    if (status == 0) {
      wx.navigateTo({ url: '/pages/shop/batchDetail?batchID=' + id })
    }
    else if (status == 1) {
      wx.redirectTo({ url: '/pages/shop/searchlist?depotID=' + id })
    }
    else if (status == 2){
      wx.redirectTo({ url: '/pages/shop/searchlist?factoryID=' + id })
    }
    else if (status == 3) {
      wx.navigateTo({ url: '/pages/auction/analysis?baleCode=' + id })
    }
  }

})

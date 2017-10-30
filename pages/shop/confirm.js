var app = getApp()
var util = require('../../utils/util.js')

Page({
  data:
  {
    listingID: '',
    items: [],
    itemsLength: 0,
    amountSum: 0,
    moneySum: "0.00",
    makeOrderLoading: false,

    deliveryModePlaceholder: {},
    deliveryModeObjArray: [],
    deliveryModeIndex: {},
    deliveryModeId: {},

    needLoanPlaceholder: {},
    needLoanObjArray: [{ id: "0", name: '否' }, { id: "1", name: '是' }],
    needLoanIndex: {},
    needLoanId: {},

    listingIds: {}

  },
  onLoad: function (options) {
    var listingID = options.listingID;
    if (util.isEmpty(listingID)) {
      return;
    }
    this.setData({ listingID: listingID })

    var share = options.share;
    share = util.isEmpty(share) ? false : true;
    if (share){
      this.loginAuth(listingID)
    }
    
  },
  onReady: function () {

  },
  onShow: function () {
    this.deliveryTypeListAjax()
    this.listingGroupListAjax();
  },
  loginAuth: function (listingID){
    var that = this
    setTimeout(function () {
      if (!app.globalData.isWxLoginComplete) {
        that.loginAuth()
        return;
      }
    }, 300);
  },
  listingGroupListAjax: function () {
    var that = this;
    var params = { open_id: app.globalData.open_id, listingID: this.data.listingID };
    util.httpReq("/trade/listingGroupList", params, "POST",
      function (res) {
        var data = res.data;
        if (data.success) {
          var list = data.entity;
          that.setData({ items: list, itemsLength: list.length })

          var amountSum = 0
          var moneySum = 0;
          var _needLoanPlaceholder = {}, _needLoanIndex = {}, _needLoanId = {}, _deliveryModePlaceholder = {}, _deliveryModeIndex = {}, _deliveryModeId = {}, _listingIds = {};
          for (var i = 0; i < list.length; i++) {
            var memberID = list[i].memberID;
            _needLoanPlaceholder[memberID] = "请选择是否要融资";
            _needLoanIndex[memberID] = "";
            _needLoanId[memberID] = "";
            _deliveryModePlaceholder[memberID] = "请选择提货方式";
            _deliveryModeIndex[memberID] = "";
            _deliveryModeId[memberID] = "";

            var listingIds = "";
            var itemList = list[i].list;
            for (var z = 0; z < itemList.length; z++) {
              listingIds += itemList[z].listingID + ",";
              amountSum++;
              if (itemList[z].indexCode == '') {
                moneySum += (itemList[z].price * itemList[z].amount)
              }
            }
            if (!util.isEmpty(listingIds))
              listingIds = listingIds.substring(0, listingIds.length - 1);
            _listingIds[memberID] = listingIds;
          }

          that.setData({
            needLoanPlaceholder: _needLoanPlaceholder, needLoanIndex: _needLoanIndex, needLoanId: _needLoanId,
            deliveryModePlaceholder: _deliveryModePlaceholder, deliveryModeIndex: _deliveryModeIndex, deliveryModeId: _deliveryModeId, listingIds: _listingIds
          })

          if (amountSum > 0)
            that.setData({ amountSum: amountSum, moneySum: util.formatMoney(moneySum, 2) })
          else
            that.setData({ amountSum: 0, moneySum: "0.00" })
        }
        else {
          util.alert(data.message);
        }
      },
      function (res) {
        util.alert(app.globalData.failMsg);
      });
  },
  // 获取配送方式列表
  deliveryTypeListAjax: function () {
    var that = this;
    util.httpReq("/bases/getDeliveryTypeList", "", "POST",
      function (result) {
        var data = result.data;
        if (data.success) {
          var entity = data.entity;
          that.setData({ deliveryModeObjArray: entity });
        }
        else {
          util.alert(data.message);
        }
      },
      function (result) {
        util.alert(app.globalData.failMsg);
      })
  },
  // 提货方式事件
  bindDeliveryModeChange: function (e) {
    var index = e.detail.value;
    var value = this.data.deliveryModeObjArray[index].deliveryType;
    var memberid = e.currentTarget.dataset.memberid;

    var _deliveryModePlaceholder = this.data.deliveryModePlaceholder;
    _deliveryModePlaceholder[memberid] = "";

    var _deliveryModeIndex = this.data.deliveryModeIndex;
    _deliveryModeIndex[memberid] = index;

    var _deliveryModeId = this.data.deliveryModeId;
    _deliveryModeId[memberid] = value;

    this.setData({ deliveryModeId: _deliveryModeId, deliveryModeIndex: _deliveryModeIndex, deliveryModePlaceholder: _deliveryModePlaceholder });
  },
  // 是否融资事件
  bindNeedLoanChange: function (e) {
    var index = e.detail.value;
    var value = this.data.needLoanObjArray[index].id;
    var memberid = e.currentTarget.dataset.memberid;

    var _needLoanPlaceholder = this.data.needLoanPlaceholder;
    _needLoanPlaceholder[memberid] = "";

    var _needLoanIndex = this.data.needLoanIndex;
    _needLoanIndex[memberid] = index;

    var _needLoanId = this.data.needLoanId;
    _needLoanId[memberid] = value;

    this.setData({ needLoanId: _needLoanId, needLoanIndex: _needLoanIndex, needLoanPlaceholder: _needLoanPlaceholder });
  },
  // 确认下单
  makeOrder: function (e) {
    var listingID = this.data.listingID;
    if (util.isEmpty(listingID)) {
      util.alert('请至少选择一个批次')
      return;
    }

    var _deliveryModeId = this.data.deliveryModeId;
    for (var id in _deliveryModeId) {
      if (util.isEmpty(_deliveryModeId[id] + '')) {
        util.alert("请选择提货方式");
        return;
      }
    }
    var _needLoanId = this.data.needLoanId;
    for (var id in _needLoanId) {
      if (util.isEmpty(_needLoanId[id] + '')) {
        util.alert("请选择是否要融资");
        return;
      }
    }

    var _listingIds = this.data.listingIds;

    var params = { open_id: app.globalData.open_id, listingIds: JSON.stringify(_listingIds), deliveryModeIds: JSON.stringify(_deliveryModeId), needLoanIds: JSON.stringify(_needLoanId) };
    var that = this;
    util.httpReq("/trade/makeOrder", params, "POST",
      function (result) {
        var data = result.data;
        if (data.success){
          wx.redirectTo({ url: 'result' })
        }
        else{
          if (util.loginAuthToLogin(data.code)) 
            return;
          util.alert(data.message);
        }
      },
      function (result) {
        util.alert(app.globalData.failMsg);
      })
  }

})

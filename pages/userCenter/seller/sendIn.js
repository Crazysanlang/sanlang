var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data:
  {
    hover_zy: 'hover',
    hover_zt: '',
    ztFlag: false,

    orderID: '',
    itemDetail: {},

    deliveryCodeValue: '',
    deliveryDateValue: '请选择提货日期',
    depotID: '',
    corpName: '请选择提货仓库',
    corpAddressValue: '',
    corpPhoneValue: '',
    depotLinkmanValue: '',

    driverNameValue: '',
    driverPhoneValue: '',
    driverIdNumberValue: '',
    truckNumberValue: '',

  },
  onLoad: function (options) {
    this.setData({ orderID: options.orderID})
  },
  onReady: function () {
    this.orderDetailAjax()
  },
  onShow: function () {
    var depotID = app.globalData.baseDepotID;
    if (!util.isEmpty(depotID)) {
      var corpName = app.globalData.baseCorpName;
      this.setData({ depotID: depotID, corpName: corpName })
      app.globalData.baseDepotID = '';
      app.globalData.baseCorpName = '';
      // 获取仓库地址和电话
      var that = this;
      var params = { open_id: app.globalData.open_id, depotID: depotID };
      util.httpReq("/bases/getDepot", params, "POST",
        function (result) {
          var data = result.data
          if (data.success) {
            var entity = data.entity;
            that.setData({ corpAddressValue: entity.address, corpPhoneValue: entity.phone, depotLinkmanValue: entity.contacter })
          }
        }, function (result) {})
    }
    var sendInItemsList = app.globalData.sendInItems;
    if (sendInItemsList != null && sendInItemsList.length > 0){
      var itemDetail = this.data.itemDetail;
      itemDetail.list = sendInItemsList;
      this.setData({ itemDetail: itemDetail })
    }
  },
  orderDetailAjax: function(){
    var that = this;
    var params = { open_id: app.globalData.open_id, orderID: this.data.orderID };
    util.httpReq("/trade/getOrder", params, "POST",
      function (result) {
        var data = result.data
        if (data.success) {
          var entity = data.entity;
          if (entity != null){
            var list = entity.list;
            for(var i = 0; i < list.length; i++){
              list[i].checkFlag = true;
            }
            app.globalData.sendInItems = list;
          }
          that.setData({ itemDetail: entity })
        }
        else {
          if (util.loginAuthToLogin(data.code)) 
            return;
          util.alert(data.message);
        }
      },
      function (result) {
        util.alert(app.globalData.failMsg);
      })
  },
  // 切换标签
  changeTab: function (e) {
    var tab = e.target.id;
    if (tab == 1)
      this.setData({hover_zy:'hover', hover_zt:'', ztFlag: false })
    else
      this.setData({hover_zy:'', hover_zt:'hover', ztFlag: true })
  },
  // 请选择提货日期
  deliveryDateBind: function(e){
    this.setData({ deliveryDateValue: e.detail.value })
  },
  // 选择仓库
  selectDepotPage: function (e) {
    wx.navigateTo({ url: '/pages/store/list' })
  },
  // 发货单号绑定
  deliveryCodeBind: function(e){
    this.setData({ deliveryCodeValue: e.detail.value })
  },
  // 仓库地址绑定
  corpAddressBind: function(e){
    this.setData({ corpAddressValue: e.detail.value })
  },
  // 仓库电话绑定
  corpPhoneBind: function(e){
    this.setData({ corpPhoneValue: e.detail.value })
  },
  // 仓库联系人绑定
  depotLinkmanBind: function(e){
    this.setData({ depotLinkmanValue: e.detail.value })
  },
  // 提货人姓名绑定
  driverNameBind: function(e){
    this.setData({ driverNameValue: e.detail.value })
  },
  // 身份证号绑定
  driverIdNumberBind: function(e){
    this.setData({ driverIdNumberValue: e.detail.value })
  },
  // 身份证号绑定
  driverPhoneBind: function(e){
    this.setData({ driverPhoneValue: e.detail.value })
  },
  // 车号绑定
  truckNumberBind: function(e){
    this.setData({ truckNumberValue: e.detail.value })
  },
  // 选择提货批次
  toSelectBatch: function(e){
    wx.navigateTo({ url: 'selectBatch?orderID=' + this.data.orderID })
  },
  // 确认发货
  makeDelivery: function(e){
    var deliveryCode = this.data.deliveryCodeValue;
    // if (util.isEmpty(deliveryCode)){
    //   util.alert("请输入发货单号");
    //   return;
    // }
    var deliveryDate = this.data.deliveryDateValue;
    if (util.isEmpty(deliveryDate) || deliveryDate == '请选择提货日期'){
      util.alert("请选择提货日期");
      return;
    }
    var depotAddress = this.data.corpAddressValue;
    if (util.isEmpty(depotAddress)){
      util.alert("请输入仓库地址");
      return;
    }
    var depotPhone = this.data.corpPhoneValue;
    if (util.isEmpty(depotAddress)){
      util.alert("请输入仓库电话");
      return;
    }
    var depotLinkman = this.data.depotLinkmanValue;
    // if (util.isEmpty(depotLinkman)){
    //   util.alert("请输入仓库联系人");
    //   return;
    // }

    var deliveryType = (this.data.ztFlag ? 0 : 1);
    if (deliveryType == 0){
      var driverName = this.data.driverNameValue;
      if (util.isEmpty(driverName)){
        util.alert("请输入提货人姓名");
        return;
      }
      var driverIdNumber = this.data.driverIdNumberValue;
      if (!util.isCardNo(driverIdNumber)){
        util.alert("提货人身份证有误");
        return;
      }
      var driverPhone = this.data.driverPhoneValue;
      if (!util.checkMobile(driverPhone)){
        util.alert("提货人手机号有误");
        return;
      }
      var truckNumber = this.data.truckNumberValue;
      if (util.isEmpty(truckNumber)){
        util.alert("请输入车号");
        return;
      }
    }

    var itemDetail = this.data.itemDetail;
    var list = itemDetail.list
    if (list == null || list.length <= 0){
      util.alert("请至少选择一个批次");
      return;
    }
    var flagCount = 0;
    for(var i = 0; i < list.length; i++){
      if (!list[i].checkFlag)
        flagCount++;
    }
    if (flagCount == list.length)
    {
      util.alert("请至少选择一个批次");
      return;
    }

    var details = [];
    for(var i = 0; i < list.length; i++){
      if (!list[i].checkFlag)
        continue;
      var temp = {};
      temp.detailID = list[i].detailID;
      temp.packnum = list[i].packnum;
      temp.amount = list[i].amount;
      details.push(temp);
    }
    
    var that = this;
    var params = { open_id: app.globalData.open_id, orderID:this.data.orderID, deliveryType:deliveryType, deliveryCode:deliveryCode, deliveryDate:deliveryDate, depotAddress:depotAddress, depotPhone:depotPhone, depotLinkman:depotLinkman , details:JSON.stringify(details) };
    if (deliveryType == 0){
      params.driverName = driverName;
      params.driverPhone = driverPhone;
      params.driverIdNumber = driverIdNumber;
      params.truckNumber = truckNumber;
    }
    util.httpReq("/trade/makeDelivery", params, "POST",
      function (res) {
        var data = res.data;
        if (data.success) {
          util.alertToBack("发货单录入成功");
        }
        else {
          if (util.loginAuthToLogin(data.code))
            return;
          util.alert(data.message);
        }
      },
      function (res) {
        util.alert(app.globalData.failMsg);
      });
  }
})

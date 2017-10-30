var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data:
  {
    items: [],
    amountSum: 0,
    moneySum: '0.00',
    checkAllFlag: true,
    detailIDs: []
  },
  onLoad: function (options) {
    var items = app.globalData.sendInItems;
    if (items == null || items.length <= 0)
    {
      wx.showModal({
        title: '系统提示',
        content: '没有批次可以选择',
        showCancel: false,
        success: function(res) {
          wx.navigateBack()
        }
      })
      return;
    }
    var amountSum = 0;
    var moneySum = 0;
    var checkAllFlag = true;
    var detailIDs = [];
    for(var i = 0; i < items.length; i++){
      if (!items[i].checkFlag){
        checkAllFlag = false;
      }
      else{
        amountSum += items[i].amount;
        moneySum += items[i].money;
        detailIDs.push(items[i].detailID)
      }
    }
    this.setData({ items:items, amountSum:amountSum, moneySum: util.formatMoney(moneySum, 2), checkAllFlag:checkAllFlag, detailIDs:detailIDs })
  },
  onReady: function () {

  },
  // checkbox选择
  checkboxChange: function(e){
    var list = this.data.items;
    var detailIDs = e.detail.value;
    this.setData({ detailIDs:detailIDs })
    if (detailIDs.length != list.length)
      this.setData({ checkAllFlag:false })
    else
      this.setData({ checkAllFlag:true })
    
    var amountSum = 0;
    var moneySum = 0;
    for(var i = 0; i < list.length; i++){
      list[i].checkFlag = false;
    }
    for(var z=0;z<detailIDs.length;z++)
    {
      var detailID = detailIDs[z];
      for(var i = 0; i < list.length; i++){
        if (detailID != list[i].detailID)
          continue;
        list[i].checkFlag = true;
        amountSum += list[i].amount;
        moneySum += list[i].money;
      }
    }
    this.setData({ items: list, amountSum:amountSum, moneySum: util.formatMoney(moneySum, 2) })
  },
  // 选择所有
  checkBoxAll: function(e){
    var list = this.data.items;
    var checkAllFlag = this.data.checkAllFlag;
    var flag = (checkAllFlag) ? false : true;
    var amountSum = 0;
    var moneySum = 0;
    var detailIDs = [];
    for(var i = 0; i < list.length; i++){
      list[i].checkFlag = flag;
      if (!list[i].checkFlag)
        continue;
      amountSum += list[i].amount;
      moneySum += list[i].money;
      detailIDs.push(list[i].detailID)
    }
    this.setData({ items: list, checkAllFlag: flag, amountSum:amountSum, moneySum: util.formatMoney(moneySum, 2), detailIDs:detailIDs })
  },
  // 返回发货页面
  toSendIn:function(e){
    var detailIDs = this.data.detailIDs;
    if (detailIDs == null || detailIDs.length <= 0){
      util.alert("请至少选择一个批次");
      return;
    }
    app.globalData.sendInItems = this.data.items;
    wx.navigateBack()
  }
  
})

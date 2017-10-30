var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data:
  {
    itemDetail: {}
  },
  onLoad: function (options) {

  },
  onReady: function () {
    var itemDetail = app.globalData.loanBeanItem;
    if (util.isEmpty(itemDetail.loanCode)) {
      util.alertToBack("数据有误，请稍后再试");
      return;
    }
    var needRepayMoney = itemDetail.needRepayMoney;
    var repayMoney = itemDetail.repayMoney;
    itemDetail.surplusFmt = util.formatMoney(needRepayMoney-repayMoney, 2);
    itemDetail.needRepayMoneyFmt = util.formatMoney(needRepayMoney, 2);
    itemDetail.chargeFmt = util.formatMoney(itemDetail.charge, 2);
    this.setData({ itemDetail: itemDetail })
  }

})

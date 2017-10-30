var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data:
  {
    orderID: '',
    invoiceDateValue: '请选择开票日期',
    invoiceCodeValue: '',
    attachDocsValue: '',
    moneyValue: '',
    amountValue: '',
    pictureProof: '',

    moneyAllValue:0,
    amountAllValue: 0
  },
  onLoad: function (options) {
    var moneyAllValue = options.money;
    if (util.isEmpty(moneyAllValue)) moneyAllValue = 0;
    var amountAllValue = options.amount;
    if (util.isEmpty(amountAllValue)) amountAllValue = 0;
    this.setData({ orderID: options.orderID, moneyAllValue:moneyAllValue, amountAllValue:amountAllValue })
  },
  onReady: function () {
  },
  onShow: function () {
  },
  // 请选择提货日期
  invoiceDateBind: function(e){
    this.setData({ invoiceDateValue: e.detail.value })
  },
  invoiceCodeBind: function(e){
    this.setData({ invoiceCodeValue: e.detail.value })
  },
  attachDocsBind: function(e){
    this.setData({ attachDocsValue: e.detail.value })
  },
  moneyBind: function(e){
    this.setData({ moneyValue: e.detail.value })
  },
  amountBind: function(e){
    this.setData({ amountValue: e.detail.value })
  },
  // 选择图片
  choosePicLicense: function(e){
    var that = this;
    wx.chooseImage({
      success: function(res) {
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.globalData.server + '/api/uploadFile',
          filePath: tempFilePaths[0],
          name: 'file',
          formData:{ type:5 },
          success: function(res1){
            if (res1.statusCode != 200){
              util.alert("上传失败，请重新上传");
              return;
            }
            var data = JSON.parse(res1.data)
            if (data.success) {
              that.setData({ tempFilePath: tempFilePaths[0], pictureProof: data.value });
            }
            else {
              util.alert(data.message);
            }
          }
        })
      }
    })
  },
  // 确认
  makeOrderInvoice: function(e)
  {
    var invoiceDate = this.data.invoiceDateValue;
    if (util.isEmpty(invoiceDate) || invoiceDate == '请选择开票日期'){
      util.alert("请选择开票日期");
      return;
    }
    var invoiceCode = this.data.invoiceCodeValue;
    if (util.isEmpty(invoiceCode)){
      util.alert("请输入发票号码");
      return;
    }
    var attachDocs = this.data.attachDocsValue;
    if (!util.isNumber(attachDocs) || attachDocs <= 0){
      util.alert("请输入附票张数");
      return;
    }
    var money = this.data.moneyValue;
    if (!util.isNumber(money) || money <= 0){
      util.alert("请输入发票金额");
      return;
    }
    var amount = this.data.amountValue;
    if (!util.isNumber(amount) || amount <= 0){
      util.alert("请输入发票数量");
      return;
    }

    var that = this;
    var params = { open_id: app.globalData.open_id, orderID:this.data.orderID, invoiceDate:invoiceDate, invoiceCode:invoiceCode, attachDocs:attachDocs, money:money, amount:amount, pictureProof:this.data.pictureProof };
    util.httpReq("/finance/makeOrderInvoice", params, "POST",
      function (res) {
        var data = res.data;
        if (data.success) {
          util.alertToBack("开票成功");
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
  },
  moneyAllBind: function(e){
    var moneyAllValue = parseFloat(this.data.moneyAllValue).toFixed(2);
    this.setData({ moneyValue: moneyAllValue })
  },
  amountAllBind: function(e){
    var amountAllValue = parseFloat(this.data.amountAllValue).toFixed(4);
    this.setData({ amountValue: amountAllValue })
  }

})

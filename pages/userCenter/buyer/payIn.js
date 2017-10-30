var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: 
  { 
    addFlag: true,
    orderID: '',
    paymentID: '',
    payTypePlaceholder: '请选择付款方式',
    payTypeObjArray: [],
    payTypeIndex: '',
    payTypeId: '',
    payDateValue: '请选择付款日期',
    payMoneyValue: '',
    buttonText: '确认提交',
    tempFilePath: '',
    pictureProof: '',
    moneyAllValue: 0
  },
  onLoad:function(options) {
    var addFlag = options.addFlag;
    addFlag = (util.isEmpty(addFlag) || addFlag == 'true') ? true : false;
    var money = options.money;
    if (util.isEmpty(money)) money = 0;
    this.setData({ addFlag: addFlag, orderID: options.orderID, moneyAllValue:money })
    if (!addFlag)
    {
      this.setData({ buttonText: '确认修改', paymentID: options.paymentID, payMoneyValue: options.payMoney, payDateValue: options.payDate, pictureProof: options.pictureProof, payTypeId: options.payTypeId })
      this.readFile(options.pictureProof)
    }
  },
  onShow: function () { 
    this.getPayTypeList()
  },
  // 日期选择
  payDateBind: function(e){
    this.setData({ payDateValue: e.detail.value })
  },
  // 付款金额绑定
  bindPayMoney: function(e){
    this.setData({ payMoneyValue: e.detail.value })
  },
  // 付款方式选择
  bindPayTypeChange:function(e){
    var index = e.detail.value;
    var value = this.data.payTypeObjArray[index].payType;
    this.setData({ payTypeId: value, payTypeIndex: index, payTypePlaceholder: '' });
  },
  // 付款方式列表
  getPayTypeList: function(){
    var that = this;
    var params = { open_id: app.globalData.open_id };
    util.httpReq("/bases/getPayTypeList", params, "POST",
      function (result) {
        var data = result.data
        if (data.success) {
          var entity = data.entity;
          that.setData({ payTypeObjArray: entity })

          var addFlag = that.data.addFlag;
          if (!addFlag){
            var index = 0;
            var payTypeId = that.data.payTypeId;
            for(var i=0;i<entity.length;i++){
              if (payTypeId == entity[i].payType)
                continue;
              index++
            }
            that.setData({ payTypeId: payTypeId, payTypeIndex: index, payTypePlaceholder: '' });
          }
        }
        else {
          util.alert(data.message);
        }
      },
      function (result) {
        util.alert(app.globalData.failMsg);
      })
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
          formData:{ type:3 },
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
  // 获取图片信息
  readFile: function(key)
  {
    if (util.isEmpty(key))
      return;
    var that = this;
    wx.downloadFile({
      url: app.globalData.server + '/api/readFile?key=' + key + '&type=3',
      success: function(res) {
        if (res.statusCode != 200){
          util.alert("获取凭证图片失败");
          return;
        }
        that.setData({ tempFilePath: res.tempFilePath, pictureProof: key });
      }
    })
  },
  // 付款提交
  makePayment:function(e){
    var payDateValue = this.data.payDateValue;
    if (util.isEmpty(payDateValue) || payDateValue == '请选择付款日期')
    {
      util.alert("请选择付款日期");
      return;
    }
    var payTypeId = this.data.payTypeId;
    if (util.isEmpty(payTypeId)){
      util.alert("请选择付款方式");
      return;
    }
    var payMoneyValue = this.data.payMoneyValue;
    if (!util.isNumber(payMoneyValue) || payMoneyValue <= 0)
    {
      util.alert("请输入有效的付款金额");
      return;
    }

    var orderID = this.data.orderID;
    var url = "/finance/makePayment";
    var params = { open_id: app.globalData.open_id, orderID: orderID, payType: payTypeId, payDate: payDateValue, payMoney: payMoneyValue, pictureProof: this.data.pictureProof };
    // 修改
    var addFlag = this.data.addFlag;
    if (!addFlag){
      url = "/finance/updatePayment";
      params = { open_id: app.globalData.open_id, paymentID: this.data.paymentID, payType: payTypeId, payDate: payDateValue, payMoney: payMoneyValue, pictureProof: this.data.pictureProof };
    }

    util.httpReq(url, params, "POST",
      function (result) {
        var data = result.data
        if (data.success) {
          util.alertToBack("付款录入成功");
          // wx.redirectTo({ url: 'orderDetail?orderID=' + orderID })
        }
        else 
        {
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
  moneyAllBind: function(e){
    var moneyAllValue = parseFloat(this.data.moneyAllValue).toFixed(2);
    this.setData({ payMoneyValue: moneyAllValue })
  }
})

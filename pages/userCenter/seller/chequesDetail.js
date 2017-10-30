var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: 
  { 
    paymentID: '',
    itemDetail: {},
    tempFilePath: '',
  },
  onLoad:function(options) { 
    this.setData({ paymentID: options.paymentID})
  },
  onShow: function () {
    this.ajaxDetail()
  },
  ajaxDetail: function(){
    var that = this;
    var params = { paymentID: this.data.paymentID, open_id: app.globalData.open_id };
    util.httpReq("/finance/getPayment", params, "POST",
      function (res) {
        var data = res.data;
        if (data.success) {
          var entity = data.entity;
          if (entity == null)
          {
            util.alertToBack("暂无收款信息");
            return;
          }
          if (entity.pictureProof != '')
            that.readFile(entity.pictureProof)
          that.setData({ itemDetail: entity })
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
  confirmPayment: function(e){
    var that = this;
    var orderID = e.currentTarget.id;
    var params = { open_id: app.globalData.open_id, paymentID: this.data.paymentID };
    util.httpReq("/finance/confirmPayment", params, "POST",
      function (result) {
        var data = result.data
        if (data.success) {
          util.alertToBack("确认收款成功");
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
  // 获取图片信息
  readFile: function(key)
  {
    var that = this;
    wx.downloadFile({
      url: app.globalData.server + '/api/readFile?key=' + key + '&type=3',
      success: function(res) {
        if (res.statusCode != 200){
          util.alert("获取图片失败");
          return;
        }
        that.setData({ tempFilePath: res.tempFilePath });
      }
    })
  },
  // 查看图片
  previewImage: function(e){
    wx.previewImage({ urls: [this.data.tempFilePath] })
  }
})

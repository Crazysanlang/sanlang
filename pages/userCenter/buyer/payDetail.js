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
  onReady: function () {
    // this.ajaxDetail()
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
            util.alertToBack("暂无付款信息");
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
  },
  // 作废付款单
  revokePayment: function(e){
    var that = this;
    wx.showModal({
      title: '系统提示',
      content: '确定删除该付款单吗？',
      success: function(res) {
        if (res.confirm) {
          var params = { open_id: app.globalData.open_id, paymentID: that.data.paymentID };
          util.httpReq("/finance/revokePayment", params, "POST",
            function (res) {
              var data = res.data;
              if (data.success) {
                util.alertToBack("付款单已删除");
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
      }
    })
  },
  // 修改付款单
  toPayIn: function(e){
    var itemDetail = this.data.itemDetail;
    var payMoney = itemDetail.payMoney;
    var payDate = itemDetail.payDate;
    var payTypeId = itemDetail.payType;
    var pictureProof = itemDetail.pictureProof;
    wx.navigateTo({ url: 'payIn?addFlag=' + false + '&paymentID=' + this.data.paymentID + '&payMoney=' + payMoney + '&payDate=' + payDate + '&payTypeId=' + payTypeId + '&pictureProof=' + pictureProof + "&money=" + payMoney })
  }
})

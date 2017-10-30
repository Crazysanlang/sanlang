var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: 
  { 
    invoiceID: '',
    memberID: '',
    itemDetail: {},
    tempFilePath: '',
  },
  onLoad:function(options) { 
    this.setData({ invoiceID: options.invoiceID, memberID: options.memberID})
  },
  onReady: function () {
    // this.ajaxDetail()
  },
  onShow: function(e){
    this.ajaxDetail()
  },
  ajaxDetail: function(){
    var that = this;
    var params = { invoiceID: this.data.invoiceID, memberID: this.data.memberID ,open_id: app.globalData.open_id };
    util.httpReq("/finance/getInvoice", params, "POST",
      function (res) {
        var data = res.data;
        if (data.success) {
          var entity = data.entity;
          if (entity == null)
          {
            util.alertToBack("暂无发票详情");
            return;
          }
          if (entity.pictureInvoice != '')
            that.readFile(entity.pictureInvoice)
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
      url: app.globalData.server + '/api/readFile?key=' + key + '&type=5',
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
  // 删除
  revokeInvoice: function(e){
    var that = this;
    wx.showModal({
      title: '系统提示',
      content: '确定删除该开票信息吗？',
      success: function(res) {
        if (res.confirm) {
          var params = { open_id: app.globalData.open_id, invoiceID: that.data.invoiceID };
          util.httpReq("/finance/revokeInvoice", params, "POST",
            function (res) {
              var data = res.data;
              if (data.success) {
                util.alertToBack("删除成功");
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
  // // 修改开票信息
  // toBillingIn: function(e){
  //   wx.navigateTo({ url: 'billingIn?invoiceID=' + this.data.invoiceID })
  // }

})

var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: 
  { 
    deliveryID: '',
    itemDetail: {}
  },
  onLoad:function(options) { 
    this.setData({ deliveryID: options.deliveryID})
  },
  onShow: function () {
    this.ajaxDetail()
  },
  ajaxDetail: function(){
    var that = this;
    var params = { deliveryID: this.data.deliveryID, open_id: app.globalData.open_id };
    util.httpReq("/trade/getDelivery", params, "POST",
      function (res) {
        var data = res.data;
        if (data.success) {
          if (data.entity == null)
          {
            util.alertToBack("暂无收货信息");
            return;
          }
          that.setData({ itemDetail: data.entity })
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
  // 确认收货
  confirmDelivery: function(e){
    var params = { open_id: app.globalData.open_id, deliveryID: this.data.deliveryID };
    util.httpReq("/trade/confirmDelivery", params, "POST",
      function (res) {
        var data = res.data;
        if (data.success) {
          util.alertToBack("确认收货成功");
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

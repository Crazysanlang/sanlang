var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: 
  { 
    class_tab_hover_0: 'tab_hover',
    class_tab_hover_1: '',
    class_tab_hover_2: '',
    class_tab_hover_3: '',
    class_tab_hover_4: '',
    class_tab_hover_5: '',
    items: [],
    firstDataFlag: true,
    status: 0
  },
  onLoad:function(options) { },
  onReady: function () { 
    
  },
  onShow:function() { 
    this.orderListAjax()
  },
  onHide: function() { },
  onUnload: function() { },
  orderStatus: function(e){
    this.setData({ class_tab_hover_0: '', class_tab_hover_1: '', class_tab_hover_2: '', class_tab_hover_3: '', class_tab_hover_4: '', class_tab_hover_5: '', })
    var status = e.currentTarget.dataset.status
    if (status == 0)
      this.setData({ class_tab_hover_0: 'tab_hover' })
    else if (status == 1)
      this.setData({ class_tab_hover_1: 'tab_hover' })
    else if (status == 2)
      this.setData({ class_tab_hover_2: 'tab_hover' })
    else if (status == 3)
      this.setData({ class_tab_hover_3: 'tab_hover' })
    else if (status == 4)
      this.setData({ class_tab_hover_4: 'tab_hover' })
    else if (status == 5)
      this.setData({ class_tab_hover_5: 'tab_hover' })
    this.setData({ status: status })
    this.orderListAjax()
  },
  orderListAjax: function(){
    var that = this;
    that.setData({ firstDataFlag: true })
    var params = { open_id: app.globalData.open_id, buySell:2, status:this.data.status };
    util.httpReq("/trade/getOrderList", params, "POST",
      function (result) {
        var data = result.data
        if (data.success) {
          var entity = data.entity;
          that.setData({ items: entity.list })
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
  // 跳转订单逻辑
  toOrderNavigate: function(e){
    var status = e.currentTarget.dataset.status;
    if (status == 0)
      wx.navigateTo({ url: 'orderAn?orderID=' + e.currentTarget.id })
    else
      wx.navigateTo({ url: 'orderDetail?orderID=' + e.currentTarget.id })
  }
})

var app = getApp()
var util = require('../../utils/util.js')

Page({
  data:
  {
    hover_class1: 'hover',
    hover_class2: '',

    tab_view1: false,
    tab_view2: true,

    nameValue: '',
    mobileValue: '',
    moneyValue: '',
    batchIDsValue: ''
  },
  onLoad: function (options) { },
  changeTable: function (e) {
    this.setData({ hover_class1:'', tab_view1:true, hover_class2:'', tab_view2:true })
    var tab = e.currentTarget.id;
    if (tab == 1) {
      this.setData({hover_class1:'hover', tab_view1: false})
    }
    else {
      this.setData({hover_class2:'hover', tab_view2: false})
    }
  },
  nameBind: function(e){
    this.setData({ nameValue:e.detail.value })
  },
  mobileBind: function(e){
    this.setData({ mobileValue:e.detail.value })
  },
  moneyBind: function(e){
    this.setData({ moneyValue:e.detail.value })
  },
  batchIDsBind: function(e){
    this.setData({ batchIDsValue:e.detail.value })
  },
  // 申请
  applyLoan: function(e){
    var name = this.data.nameValue;
    if (util.isEmpty(name)){
      util.alert('请输入申请人姓名')
      return;
    }
    var mobile = this.data.mobileValue;
    if (!util.checkMobile(mobile)){
      util.alert('联系人手机号格式有误')
      return;
    }

    var money = this.data.moneyValue;
    if (!util.isNumber(money) || money <= 0)
    {
      util.alert('融资金额必须大于0')
      return;
    }
    
    var batchIDs = this.data.batchIDsValue;

    var that = this;
    var params = { open_id: app.globalData.open_id, loanType:0, mobile:mobile, money:money, name:name, batchIDs:batchIDs };
    util.httpReq("/trade/applyLoan", params, "POST",
      function (res) {
        var data = res.data;
        if (data.success) {
          wx.redirectTo({ url: 'result' })
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

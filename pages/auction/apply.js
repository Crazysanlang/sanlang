var app = getApp()
var util = require('../../utils/util.js')

Page({
  data: 
  { 
    baleCode: '',
    tab_hover1: 'hover',
    tab_hover2: '',
    tab_view1: false,
    tab_view2: true,

    needLoanPlaceholder: '请选择',
    needLoanObjArray: [{ id: "0", name: '否' }, { id: "1", name: '是' }],
    needLoanIndex: '',
    needLoanId: '',

    nameValue: '',
    mobileValue: '',
    moneyValue: '',
  },
  onLoad:function(options) { 
    this.setData({ baleCode:options.baleCode })
  },
  changeTable: function(e){
    var id = e.currentTarget.id;
    this.setData({ tab_hover1:'', tab_hover2:'', tab_view1:true, tab_view2:true })
    if (id == 1){
      this.setData({ tab_hover1:'hover', tab_view1:false })
    }
    else{
      this.setData({ tab_hover2:'hover', tab_view2:false })
    }
  },
  nameBind: function(e){
    this.setData({ nameValue: e.detail.value })
  },
  mobileBind: function(e){
    this.setData({ mobileValue: e.detail.value })
  },
  moneyBind: function(e){
    this.setData({ moneyValue: e.detail.value })
  },
  bindNeedLoanChange: function (e) {
    var index = e.detail.value;
    var value = this.data.needLoanObjArray[index].id;
    this.setData({ needLoanIndex: index, needLoanId: value, needLoanPlaceholder: '' });
  },
  applyCottonSale: function(){
    var bundleNo = this.data.baleCode;
    var name = this.data.nameValue;
    if (util.isEmpty(name)){
      util.alert("请输入申请人姓名");
      return;
    }
    var phone = this.data.mobileValue;
    if (!util.checkMobile(phone)){
      util.alert("请输入正确的联系人手机号");
      return;
    }
    var money = this.data.moneyValue;
    if (!util.isNumber(money) || money <= 0){
      util.alert("请输入正确的最高接受价格");
      return;
    }

    var needLoan = this.data.needLoanId;
    if (util.isEmpty(needLoan)){
      util.alert("请选择是否需要融资");
      return;
    }

    var params = { open_id: app.globalData.open_id, bundleNo:bundleNo, name:name, phone:phone, money:money, needLoan:needLoan };
    var that = this;
    util.httpReq("/trade/applyCottonSale", params, "POST",
      function (result) {
        var data = result.data;
        if (data.success){
          util.alertToBack("申请成功");
        }
        else{
          if (util.loginAuthToLogin(data.code)) 
            return;
          util.alert(data.message);
        }
      },
      function (result) {
        util.alert(app.globalData.failMsg);
      })
  }
})

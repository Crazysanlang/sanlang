var app = getApp()
var util = require('../../utils/util.js')

Page({
  data:
  {
    userInfoData: {},
    corpNameFull: '',
    isLoginFlag: false,
    buyPaymentCount: 0,
    buyDeliveryCount: 0,
    buyInvoiceCount: 0,
    sellPaymentCount: 0,
    sellDeliveryCount: 0,
    sellInvoiceCount: 0,
    buyConfirmCount: 0,
    sellConfirmCount: 0,
    userID: 0,
    memberID: 0,
    name: '',
    mobile: ''
  },
  onLoad: function (options) {

  },
  onReady: function () {
    this.setData({ userInfoData: app.globalData.userInfo })
  },
  onShow: function () {
    this.isLoginAuth()
  },
  // 是否登录
  isLoginAuth: function () {
    var that = this
    util.showLoading()
    setTimeout(function () {
      if (!app.globalData.isWxLoginComplete) {
        that.isLoginAuth()
        return;
      }
      var params = { open_id: app.globalData.open_id, js_code: app.globalData.js_code };
      util.httpReq("/user/wxLogin", params, "POST",
        function (res) {
          var data = res.data;
          app.globalData.isLoginCode = data.code
          if (data.success) {
            that.setData({ isLoginFlag: true })
            that.userInfoAjax();
          }
          else {
            that.setData({ isLoginFlag: false })
            util.hideLoading()
          }
          that.businessBean()
        },
        function (res) {
          util.alert(app.globalData.failMsg);
          util.hideLoading()
        });
    }, 300);
  },
  // 代办事项
  businessBean: function () {
    if (!this.data.isLoginFlag) {
      this.setData({ buyPaymentCount: 0, buyDeliveryCount: 0, buyInvoiceCount: 0, sellPaymentCount: 0, sellDeliveryCount: 0, sellInvoiceCount: 0, buyConfirmCount: 0, sellConfirmCount: 0 })
      return;
    }
    var that = this;
    var params = { open_id: app.globalData.open_id };
    util.httpReq("/trade/businessBean", params, "POST",
      function (res) {
        var data = res.data;
        if (data.success) {
          var entity = data.entity;
          that.setData({ buyPaymentCount: entity.buyPaymentCount, buyDeliveryCount: entity.buyDeliveryCount, buyInvoiceCount: entity.buyInvoiceCount, sellPaymentCount: entity.sellPaymentCount, sellDeliveryCount: entity.sellDeliveryCount, sellInvoiceCount: entity.sellInvoiceCount, buyConfirmCount: entity.buyConfirmCount, sellConfirmCount: entity.sellConfirmCount })
        }
        else {
          that.setData({ buyPaymentCount: 0, buyDeliveryCount: 0, buyInvoiceCount: 0, sellPaymentCount: 0, sellDeliveryCount: 0, sellInvoiceCount: 0, buyConfirmCount: 0, sellConfirmCount: 0 })
        }
      },
      function (res) {
        that.setData({ buyPaymentCount: 0, buyDeliveryCount: 0, buyInvoiceCount: 0, sellPaymentCount: 0, sellDeliveryCount: 0, sellInvoiceCount: 0, buyConfirmCount: 0, sellConfirmCount: 0 })
      });
  },
  // 获取用户信息
  userInfoAjax: function () {
    var that = this
    var params = { open_id: app.globalData.open_id };
    util.httpReq("/user/userInfo", params, "POST",
      function (res) {
        var data = res.data;
        if (data.success) {
          var entity = data.entity;
          if (entity == null) {
            util.hideLoading()
            return;
          }
          var user = entity.user;
          if (user != null) {
            that.setData({ userID: user.userID, name: user.name, mobile: user.mobile })
          }
          var member = entity.member;
          if (member == null) {
            that.applyMember();
            return;
          }
          that.setData({ corpNameFull: member.corpNameFull, memberID: member.memberID })
        }
        else {
          if (util.loginAuthToLogin(data.code))
            return;
          util.alert(data.message);
        }
        util.hideLoading()
      },
      function (res) {
        util.alert(app.globalData.failMsg);
        util.hideLoading()
      });
  },
  // 获取企业申请认证信息
  applyMember: function () {
    var that = this
    var params = { open_id: app.globalData.open_id };
    util.httpReq("/user/getApplyMember", params, "POST",
      function (res) {
        that.setData({ corpNameFull: '企业尚未认证' })
        var data = res.data;
        if (data.success) {
          var entity = data.entity;
          if (entity != null && entity == 0) {
            that.setData({ corpNameFull: '企业认证申请已提交，请等待审核' })
          }
        }
        util.hideLoading()
      },
      function (res) {
        util.hideLoading()
      });
  },
  // 登录
  toLogin: function (e) {
    wx.navigateTo({ url: '/pages/user/login' })
  },
  // 帐号中心
  toAccount: function (e) {
    if (!this.data.isLoginFlag) {
      wx.navigateTo({ url: '/pages/user/login' })
      return;
    }
    wx.navigateTo({ url: '/pages/userCenter/account/index' })
  },
  // 购物车
  toShopping: function (e) {
    if (!this.data.isLoginFlag) {
      wx.navigateTo({ url: '/pages/user/login' })
      return;
    }
    wx.navigateTo({ url: '../shop/shopping' })
  },
  // 我的订单
  toOrderList: function (e) {
    if (!this.data.isLoginFlag) {
      wx.navigateTo({ url: '/pages/user/login' })
      return;
    }
    wx.navigateTo({ url: 'buyer/order' })
  },
  // 采购付款
  toPay: function (e) {
    if (!this.data.isLoginFlag) {
      wx.navigateTo({ url: '/pages/user/login' })
      return;
    }
    wx.navigateTo({ url: 'buyer/pay' })
  },
  // 采购收获
  toRecipient: function (e) {
    if (!this.data.isLoginFlag) {
      wx.navigateTo({ url: '/pages/user/login' })
      return;
    }
    wx.navigateTo({ url: 'buyer/recipient' })
  },
  // 采购发票
  toInvoice: function (e) {
    if (!this.data.isLoginFlag) {
      wx.navigateTo({ url: '/pages/user/login' })
      return;
    }
    wx.navigateTo({ url: 'buyer/invoice' })
  },
  // 我的融资
  toFinance: function (e) {
    if (!this.data.isLoginFlag) {
      wx.navigateTo({ url: '/pages/user/login' })
      return;
    }
    wx.navigateTo({ url: 'buyer/finance' })
  },
  // 挂牌定价
  toListingIn: function (e) {
    if (!this.data.isLoginFlag) {
      wx.navigateTo({ url: '/pages/user/login' })
      return;
    }
    wx.navigateTo({ url: 'seller/listingIn' })
  },
  // 挂牌列表
  toListing: function (e) {
    if (!this.data.isLoginFlag) {
      wx.navigateTo({ url: '/pages/user/login' })
      return;
    }
    wx.navigateTo({ url: 'seller/listing' })
  },
  // 销售订单
  toOrderList2: function (e) {
    if (!this.data.isLoginFlag) {
      wx.navigateTo({ url: '/pages/user/login' })
      return;
    }
    wx.navigateTo({ url: 'seller/order' })
  },
  // 卖家收款
  toCheques: function (e) {
    if (!this.data.isLoginFlag) {
      wx.navigateTo({ url: '/pages/user/login' })
      return;
    }
    wx.navigateTo({ url: 'seller/cheques' })
  },
  // 卖家发货
  toSend: function (e) {
    if (!this.data.isLoginFlag) {
      wx.navigateTo({ url: '/pages/user/login' })
      return;
    }
    wx.navigateTo({ url: 'seller/send' })
  },
  // 卖家开票
  toBilling: function (e) {
    if (!this.data.isLoginFlag) {
      wx.navigateTo({ url: '/pages/user/login' })
      return;
    }
    wx.navigateTo({ url: 'seller/billing' })
  },
  // 我的质押
  toPledge: function (e) {
    if (!this.data.isLoginFlag) {
      wx.navigateTo({ url: '/pages/user/login' })
      return;
    }
    wx.navigateTo({ url: 'seller/pledge' })
  },
  // 站内信息
  toInfo: function (e) {
    if (!this.data.isLoginFlag) {
      wx.navigateTo({ url: '/pages/user/login' })
      return;
    }
    wx.navigateTo({ url: '/pages/userCenter/account/info' })
  },
  // 出价记录
  toBid: function (e) {
    // if (!this.data.isLoginFlag) {
    //   wx.navigateTo({ url: '/pages/user/login' })
    //   return;
    // }
    wx.navigateTo({ url: '/pages/newAdd/bidRecord' })
  },
  // 资源单分享
  toShare: function (e) {
    if (!this.data.isLoginFlag) {
      wx.navigateTo({ url: '/pages/user/login' })
      return;
    }
    var userID = this.data.userID;
    var memberID = this.data.memberID;
    var name = decodeURIComponent(this.data.name);
    var mobile = this.data.mobile;
    var nickName = decodeURIComponent(this.data.userInfoData.nickName);
    wx.navigateTo({ url: '/pages/userCenter/share/index?userID=' + userID + '&nickName=' + nickName + '&memberID=' + memberID + '&name=' + name + '&mobile=' + mobile })
  }

})

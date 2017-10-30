var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: 
  { 
    contactsItem: {}
  },
  onLoad:function(options) { 
    this.setData({ contactsItem: app.globalData.contactsItem })
  },
  makePhoneCall: function (e) {
    wx.makePhoneCall({ phoneNumber: this.data.contactsItem.buyUserMobile })
  }
})

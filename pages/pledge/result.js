var app = getApp()
var util = require('../../utils/util.js')

Page({
  data: {
    phoneNumber: '4006018895',
    phoneNumberFmt: '400 601 8895'
  },
  toIndex: function (e) {
    wx.switchTab({ url: '/pages/index/index' })
  },
  makePhoneCall: function (e) {
    wx.makePhoneCall({ phoneNumber: this.data.phoneNumber })
  }
})

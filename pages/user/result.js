var app = getApp()
var util = require('../../utils/util.js')

Page({
  data: {},
  toShop:function(e)
  {
    wx.switchTab({ url: '/pages/shop/list'})
  }
})

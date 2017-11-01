// pages/bidding/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    char_lt: "<",
    showtab:1
  },

  onLoad: function (options) {
  
  },

  onReady: function () {
  
  },

  onShow: function () {
  
  },
  bindTabnav:function(e){
    console.log(e)
    this.setData({ showtab: e.currentTarget.dataset.tabnav })
  }
})

var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: {
    trdListBean:{}, //数据回填
    falg:true,//粮食回填判断
  },
  onLoad: function (options) {
  
  },
  onReady: function () {
  
  },
  onShow: function () {
    this.data.trdListBean= app.globalData.trdListBean;

  },
  onHide: function () {
 
  },
  onUnload: function () {
  
  },


  toMsgEnter:function(){
      wx.navigateTo({
        url: '/pages/my/release/msgEnter',
      })

  }
})
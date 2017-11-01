var app = getApp()
var util = require('../../utils/util.js')

Page({
  data: {
    shownavindex: '',
    isShow:false
  },
  onLoad: function (options) {
  },
  onShow: function(e){
  },
  onReady: function () {
  },
  // 导航点击事件
  bindnavTable:function(e){
    if (this.data.shownavindex == e.currentTarget.dataset.nav){
        this.setData({shownavindex: '',isShow: false,})
    }else{
      this.setData({shownavindex: e.currentTarget.dataset.nav,isShow: true,})
    }
  },
  hideAll:function(){
    this.setData({isShow: false,shownavindex:''})
  }
})
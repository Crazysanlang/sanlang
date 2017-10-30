var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data:{
    messageItem: {}
  },
  onLoad:function(options){
    
  },
  onReady:function(){
    var messageItem = app.globalData.messageItem;
    if (util.isEmpty(messageItem.content)) {
      util.alertToBack("读取消息失败，请稍后再试");
      return;
    }
    var title = "消息中心";
    if (messageItem.msgType == 1)
      title = "系统消息";
    else if (messageItem.msgType == 2)
      title = "交易通知";
    wx.setNavigationBarTitle({ title: title })
    this.setData({ messageItem:messageItem })
  }
})
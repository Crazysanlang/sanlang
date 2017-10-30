var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: {
    delBtnWidth: 180,  //删除按钮宽度单位（rpx）
    windowHeight: 0,

    class_tab_hover_0: 'tab_hover',
    class_tab_hover_1: '',
    class_tab_hover_2: '',

    messageType: 0,
    items: [],
    firstDataFlag: true,
    pageNum: 1,
    moreFlag: false,
  },
  onLoad: function (options) {
  },
  onReady: function () {
    this.initEleWidth();
    this.setData({ windowHeight: app.globalData.windowHeight })
    this.messageListAjax()
  },
  messageTypeBind: function (e) {
    this.setData({ class_tab_hover_0: '', class_tab_hover_1: '', class_tab_hover_2: '', pageNum: 1 })
    var _type = e.currentTarget.dataset.type
    if (_type == 0)
      this.setData({ class_tab_hover_0: 'tab_hover' })
    else if (_type == 1)
      this.setData({ class_tab_hover_1: 'tab_hover' })
    else if (_type == 2)
      this.setData({ class_tab_hover_2: 'tab_hover' })

    this.setData({ messageType: _type })
    this.messageListAjax()
  },
  // 消息列表数据
  messageListAjax: function () {
    var that = this;
    var pageNum = this.data.pageNum;
    if (pageNum == 1)
      this.setData({ firstDataFlag: true })
    this.setData({ moreFlag: false })
    var params = { open_id: app.globalData.open_id, type: this.data.messageType, pageNum: this.data.pageNum };
    util.httpReq("/user/getMessageList", params, "POST",
      function (result) {
        var data = result.data
        if (data.success) {
          var entity = data.entity;
          var totalPage = entity.totalPage;
          // 总页数大于当前页，则有更多按钮
          if (totalPage > pageNum)
            that.setData({ moreFlag: true })
          var list = entity.list;
          for (var i = 0; i < list.length; i++)
            list[i].txtStyle = "";
          if (pageNum == 1)
            that.setData({ items: list })
          else
            that.setData({ items: that.data.items.concat(list) }) // 添加列表元素
        }
        else {
          if (util.loginAuthToLogin(data.code))
            return;
          util.alert(data.message);
        }
        that.setData({ firstDataFlag: false })
      },
      function (result) {
        util.alert(app.globalData.failMsg);
      })
  },
  // 更多
  moreList: function () {
    var pageNum = this.data.pageNum;
    this.setData({ pageNum: pageNum + 1 })
    this.messageListAjax()
  },
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY
      });
    }
  },
  // 去详情
  toMessageDetail: function (e) {
    var listID = e.currentTarget.id;
    var list = this.data.items;
    if (list != null && list.length > 0) {
      var messageDetail = {};
      for (var i = 0; i < list.length; i++) {
        if (listID != list[i].listID)
          continue;
        messageDetail = list[i];
      }
      app.globalData.messageItem = messageDetail;
    }

    if (messageDetail.isRead == 0) {
      var that = this;
      var params = { open_id: app.globalData.open_id, messageID: listID };
      util.httpReq("/user/markMessage", params, "POST",
        function (res) {
          var data = res.data;
          if (data.success) {
            if (list != null && list.length > 0) {
              for (var i = 0; i < list.length; i++) {
                if (listID != list[i].listID)
                  continue;
                list[i].isRead = 1;
              }
              that.setData({ items: list });
            }
          }
          else {
            util.alert(data.message);
          }
        },
        function (res) {
          util.alert(app.globalData.failMsg);
        });
    }
    // 跳转详情
    wx.navigateTo({ url: 'infoDetail?messageID=' + listID })
  },
  touchM: function (e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指移动时垂直方向位置
      var moveY = e.touches[0].clientY;
      //手指起始点位置与移动期间的差值
      var disY = this.data.startY - moveY;
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disY < 60 && disY > -60 ){
        if (disX == 100 || disX < 100 || disY >60 || disY < -60 || disY==60) {//如果移动距离小于等于0，文本层位置不变
          txtStyle = "left:0px";
        } else if (disX > 100) {//移动距离大于0，文本层left值等于手指移动距离
          txtStyle = "left:-" + disX + "px";
          if (disX >= delBtnWidth) {
            //控制手指移动距离最大值为删除按钮的宽度
            txtStyle = "left:-" + delBtnWidth + "px";
          }
        }
      }
      //获取手指触摸的是哪一项
      var index = e.target.dataset.index;
      var list = this.data.items;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({ items: list });
    }
  },
  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //手指移动结束后垂直位置
      var endY = e.changedTouches[0].clientY;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var disY = this.data.startY - endY;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      if (disY >60 || disY < -60 || disY== 60)
        txtStyle = "left:0px";
      //获取手指触摸的是哪一项
      var index = e.target.dataset.index;
      var list = this.data.items;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({ items: list });
    }
  },
  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },
  //点击删除按钮事件
  delItem: function (e) {
    var index = e.target.dataset.index;
    var list = this.data.items;

    var listID = e.currentTarget.id;
    var that = this;
    var params = { open_id: app.globalData.open_id, messageID: listID };
    util.httpReq("/user/removeMessage", params, "POST",
      function (res) {
        var data = res.data;
        if (data.success) {
          wx.showToast({ title: '删除成功', icon: 'success', duration: 1000, success: function()
          {
            list.splice(index, 1);
            that.setData({ items: list });
          }})
        }
        else {
          util.alert(data.message);
        }
      },
      function (res) {
        util.alert(app.globalData.failMsg);
      });
  }

})



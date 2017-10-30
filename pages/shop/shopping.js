var app = getApp()
var util = require('../../utils/util.js')

Page({
  data:
  {
    firstDataFlag: true,
    items: [],
    makeOrderDisabled: true,
    makeOrderLoading: false,
    amountSum: 0,
    moneySum: "0.00",
    delBtnWidth: 90,
    windowHeight: 0
  },
  onLoad: function (options) {
  },
  onReady: function () {
    this.setData({ windowHeight: app.globalData.windowHeight })
  },
  onShow: function () {
    this.listCartItem()
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
      
      if(disY<100 && disY>-100){
        if (disX == 100 || disX < 100 ) {//如果移动距离小于等于0，文本层位置不变
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
      if (list != null && list.length > 0) {
        for (var i = 0; i < list.length; i++) {
          var listBean = list[i].list;
          if (listBean == null || listBean.length <= 0) 
            continue;
          for (var z = 0; z < listBean.length; z++)
          {
            if (index == listBean[z].batchID)
              listBean[z].txtStyle = txtStyle;
          }
        }
      }
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
      if (disY > 100 || disY < -100)
        txtStyle = "left:0px";
      //获取手指触摸的是哪一项
      var index = e.target.dataset.index;
      var list = this.data.items;
      if (list != null && list.length > 0) {
        for (var i = 0; i < list.length; i++) {
          var listBean = list[i].list;
          if (listBean == null || listBean.length <= 0)
            continue;
          for (var z = 0; z < listBean.length; z++)
          {
            if (index == listBean[z].batchID)
              listBean[z].txtStyle = txtStyle;
          }
        }
      }
      // list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({ items: list });
    }
  },
  // 删除
  delItem: function(e){
    var listingID = e.currentTarget.id;
    var that = this;
    var params = { open_id: app.globalData.open_id, listingID: listingID };
    util.httpReq("/trade/removeCartItem", params, "POST",
      function (res) {
        var data = res.data;
        if (data.success) {
          wx.showToast({ title: '删除成功', icon: 'success', duration: 1000, success: function()
          {
            that.listCartItem()
          }})
        }
        else {
          util.alert(data.message);
        }
      },
      function (res) {
        util.alert(app.globalData.failMsg);
      });
  },
  // 购物车
  listCartItem: function () {
    var that = this;
    var params = { open_id: app.globalData.open_id };
    util.httpReq("/trade/listCartItem", params, "POST",
      function (res) {
        var data = res.data;
        if (data.success) {
          var list = data.entity;
          if (list != null && list.length > 0) {
            for (var i = 0; i < list.length; i++) {
              var listBean = list[i].list;
              if (listBean == null || listBean.length <= 0) 
                continue;
              for (var z = 0; z < listBean.length; z++)
                listBean[z].txtStyle = '';
            }
          }
          that.setData({ items: list })
        }
        else {
          if (util.loginAuthToLogin(data.code))
            return;
          util.alert(data.message);
        }
        that.setData({ firstDataFlag: false })
      },
      function (res) {
        util.alert(app.globalData.failMsg);
      });
  },
  // checkbox 勾选绑定事件
  bindCheckbox: function (e) {
    var index = e.currentTarget.dataset.index;
    var memberid = e.currentTarget.dataset.memberid;
    var list = this.data.items;
    if ("true" == index) {
      for (var i = 0; i < list.length; i++) {
        var itemList = list[i].list;
        var checkType = list[i].checkType;
        for (var z = 0; z < itemList.length; z++) {
          if (memberid == list[i].memberID) {
            if ("circle" == checkType) {
              list[i].checkType = "success_circle";
              itemList[z].checkType = "success_circle";
            }
            else {
              list[i].checkType = "circle";
              itemList[z].checkType = "circle";
            }
          }
        }
      }
      this.setData({ items: list })
    }
    else {
      var listingid = e.currentTarget.dataset.listingid;
      for (var i = 0; i < list.length; i++) {
        var itemList = list[i].list;
        var w = 0;
        for (var z = 0; z < itemList.length; z++) {
          var checkType = itemList[z].checkType;
          if (listingid == itemList[z].listingID) {
            if ("circle" == checkType) itemList[z].checkType = "success_circle";
            else itemList[z].checkType = "circle";
          }
          if (memberid == itemList[z].memberID) {
            if ("success_circle" == itemList[z].checkType) w++;
            if (itemList.length == w) list[i].checkType = "success_circle";
            else list[i].checkType = "circle";
          }
        }
      }
      this.setData({ items: list })
    }

    // 获取勾选的listingIDs
    var listingIDs = "";
    var moneySum = 0;
    for (var i = 0; i < list.length; i++) {
      var itemList = list[i].list;
      for (var z = 0; z < itemList.length; z++) {
        if ("success_circle" == itemList[z].checkType) {
          listingIDs += itemList[z].listingID + ",";
          if (itemList[z].indexCode == ''){
            moneySum += (itemList[z].price * itemList[z].amount);
          }
        }
      }
    }
    if (util.isEmpty(listingIDs)) {
      this.setData({ amountSum: 0, moneySum: "0.00", makeOrderDisabled: true })
      return;
    }
    listingIDs = listingIDs.substring(0, listingIDs.length - 1);
    this.setData({ amountSum: listingIDs.split(",").length, moneySum: util.formatMoney(moneySum, 2), makeOrderDisabled: false })
  },
  // 提交订单
  toConfirm: function (e) {
    // 获取勾选的listingIDs
    var listingIDs = "";
    var list = this.data.items;
    for (var i = 0; i < list.length; i++) {
      var itemList = list[i].list;
      for (var z = 0; z < itemList.length; z++) {
        if ("success_circle" == itemList[z].checkType)
          listingIDs += itemList[z].listingID + ",";
      }
    }
    if (util.isEmpty(listingIDs)) {
      util.alert("请选择");
      return;
    }
    listingIDs = listingIDs.substring(0, listingIDs.length - 1);
    wx.navigateTo({ url: 'confirm?listingID=' + listingIDs })
  },
  // 分享页面
  onShareAppMessage: function () {
    var listingIDs = "";
    var list = this.data.items;
    for (var i = 0; i < list.length; i++) {
      var itemList = list[i].list;
      for (var z = 0; z < itemList.length; z++) {
        if ("success_circle" == itemList[z].checkType)
          listingIDs += itemList[z].listingID + ",";
      }
    }
    if (!util.isEmpty(listingIDs)) {
      listingIDs = listingIDs.substring(0, listingIDs.length - 1);

      return {
        title: '棉联商城',
        path: '/pages/shop/confirm?share=true&listingID=' + listingIDs,
        success: function (res) {
          wx.showToast({
            title: '分享成功',
            icon: 'success',
            duration: 1500
          })
        }
      }
    }
    else{
      util.alert('请选择需要分享的批次')
    }

  }

})

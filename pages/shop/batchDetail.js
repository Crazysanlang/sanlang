var app = getApp()
var util = require('../../utils/util.js')

Page({
  data:
  {
    batchID: '',
    itemDetail: {},
    cartCount: 0,
    cpxqlista_hidden: false,
    cpxqlistb_hidden: true,
    cpxqlista_hover: "hover",
    cpxqlistb_hover: "",
    cottonPackFirstDataFlag: true,
    cottonPackItems: [],
    cottonPackItemsLength: 0,
    bottomFlag: false,
    // screenWidth: 0,
    iphoneflag:false,
    sitp_loading:false,
    sitp_disabled: false
  },
  onReady: function () {
    
  },
  onLoad: function (options) {
    //this.setData({ screenWidth: app.globalData.screenWidth})
    if (app.globalData.screenWidth<=320){
      this.setData({ iphoneflag :true})
    }

    wx.setNavigationBarTitle({ title: options.batchID })
    this.setData({ batchID: options.batchID })
    var bottomFlag = options.bottomFlag;
    if (!util.isEmpty(bottomFlag))
      this.setData({ bottomFlag: false })
    else
      this.setData({ bottomFlag: true })
  },
  onShow: function () {
    this.cottonBatchDetail()
    this.cottonPackList()
    this.cartCount()
  },
  onHide: function () { },
  onUnload: function () { },
  // 详情
  cottonBatchDetail: function () {
    var that = this;
    var params = { batchID: this.data.batchID, open_id: app.globalData.open_id };
    util.httpReq("/product/getCottonBatch", params, "POST",
      function (res) {
        var data = res.data;
        if (data.success) {
          var entity = data.entity;
          console.log(entity)
          var listingID = '';
          if (entity != null)
            listingID = entity.listingID;
          if (util.isEmpty(listingID))
            that.setData({ bottomFlag: false })
          that.setData({ itemDetail: entity })
        }
        else {
          util.alert(data.message);
        }
      },
      function (res) {
        util.alert(app.globalData.failMsg);
      });
  },
  // 批号取得包信息
  cottonPackList: function () {
    var that = this;
    var params = { batchID: this.data.batchID, open_id: app.globalData.open_id };
    util.httpReq("/product/getCottonPack", params, "POST",
      function (res) {
        var data = res.data;
        if (data.success) {
          that.setData({ cottonPackItems: data.entity, cottonPackItemsLength: data.entity.length })
        }
        that.setData({ cottonPackFirstDataFlag: false })
      },
      function (res) {
        util.alert(app.globalData.failMsg);
      });
  },
  // 切换detail页面内容
  detailView: function(e){
    var index = e.currentTarget.dataset.index;
    if ("1" == index)
    {
      this.setData({cpxqlista_hidden: false, cpxqlistb_hidden: true, cpxqlista_hover: "hover", cpxqlistb_hover: ""})
    }
    else
    {
      this.setData({cpxqlista_hidden: true, cpxqlistb_hidden: false, cpxqlista_hover: "", cpxqlistb_hover: "hover"})
    }
  },
  // 购物车
  toShopping: function (e) {
    wx.navigateTo({ url: 'shopping' })
  },
  // 加入购物车
  addCartItem: function (e) {
    var that = this;
    var params = { listingID: e.currentTarget.id, open_id: app.globalData.open_id };
    util.httpReq("/trade/addCartItem", params, "POST",
      function (res) {
        var data = res.data;
        if (data.success) {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 1500,
            success: function () { that.cartCount() }
          })
        }
        else {
          if (util.loginAuthToLogin(data.code)) 
            return;
          util.alert(data.message);
        }
      },
      function (res) {
        util.alert(app.globalData.failMsg);
      });
  },
  // 购物车条数
  cartCount: function () {
    var that = this;
    var params = { open_id: app.globalData.open_id };
    util.httpReq("/trade/cartCount", params, "POST",
      function (res) {
        var data = res.data;
        if (data.success) {
          that.setData({ cartCount: data.entity })
        }
      },
      function (res) {
        util.alert(app.globalData.failMsg);
      });
  },
  // 下单
  toConfirm: function (e) {
    wx.navigateTo({ url: 'confirm?listingID=' + e.currentTarget.id })
  },
  // 分享页面
  onShareAppMessage: function () {
    var batchID = this.data.batchID;
    return {
      title: batchID,
      path: '/pages/shop/batchDetail?batchID=' + batchID,
      success: function(res) {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 1500
        })
      }
    }
  },
  // 保存图片到相册
  saveImageToPhotos: function(){
    if (!wx.saveImageToPhotosAlbum)
    {
      util.alert('请更新微信至最新版本');
      return;
    }

    var that = this;
    that.setData({ sitp_loading: true, sitp_disabled:true})

    wx.getImageInfo({
      src: app.globalData.server + '/product/printPng?batchID=' + this.data.batchID,
      success: function (res) {
        var path = res.path;
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success(res) {
            wx.showToast({
              title: '已保存至相册',
              icon: 'success',
              duration: 1500
            })
          },
          fail(res){
            util.alert(res.errMsg);
          },
          complete()
          {
            that.setData({ sitp_loading: false, sitp_disabled: false })
          }
        })

      }
    })

  }

})

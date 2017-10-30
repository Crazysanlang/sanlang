var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: {
    orderID: '',
    pic: '',    // 合同pdf文件
    imageItem: [],
    url: ''
  },
  onLoad: function (options) {
    var url = app.globalData.server + '/api/readFile?key=' + options.pic + '&type=2';
    this.setData({ orderID:options.orderID, pic:options.pic, url:url })
  },
  onReady: function () {

  },
  openDocument: function(){
    var pic = this.data.pic;
    wx.downloadFile({
      url: app.globalData.server + '/api/readFile?key=' + pic + '&type=2',
      success: function (res) {
        var filePath = res.tempFilePath;
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
          },
          fail: function(res){
            util.alert('当前系统无法打开该文件');
          }
        })
      }
    })
  },
  // 选择上传图片
  choosePicLicense: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        // 上传图片
        wx.uploadFile({
          url: app.globalData.server + '/api/uploadFile.do',
          filePath: tempFilePaths[0],
          name: 'file',
          formData:{ type:2 },
          success: function (res1) {
            if (res1.statusCode != 200){
              util.alert("上传失败，请重新上传");
              return;
            }
            var data = JSON.parse(res1.data)
            if (data.success) {
              var imageItem = that.data.imageItem;
              var picDetail = {};
              picDetail.path = tempFilePaths[0];
              picDetail.value = data.value;
              imageItem.push(picDetail)
              that.setData({ imageItem: imageItem });
            }
            else {
              util.alert(data.message);
            }
          }
        })
      }
    })
  },
  // 重新上传图片
  editPic: function (index) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        // 上传图片
        wx.uploadFile({
          url: app.globalData.server + '/api/uploadFile.do',
          filePath: tempFilePaths[0],
          name: 'file',
          formData:{ type:2 },
          success: function (res1) {
            if (res1.statusCode != 200){
              util.alert("上传失败，请重新上传");
              return;
            }
            var data = JSON.parse(res1.data)
            if (data.success) {
              var imageItem = that.data.imageItem;
              var picDetail = {};
              picDetail.path = tempFilePaths[0];
              picDetail.value = data.value;
              imageItem.splice(index, 1, picDetail)
              that.setData({ imageItem: imageItem });
            }
            else {
              util.alert(data.message);
            }
          }
        })
      }
    })
  },
  // 图片删除/请重新上传
  chooseAction: function(e){
    var that = this;
    var id = e.currentTarget.id;
    var value = e.currentTarget.dataset.value;
    wx.showActionSheet({
      itemList: ['重新上传', '删除图片'],
      success: function(res) {
        var index = res.tapIndex;
        if (index == 0){
          that.editPic(id)
        }
        else if (index == 1){
          var imageItem = that.data.imageItem;
          if (imageItem == null || imageItem.length <= 0)
            return;
          var _imageItem = []
          for(var i = 0; i < imageItem.length; i++){
            if (value == imageItem[i].value)
              continue;
            _imageItem.push(imageItem[i]);
          }
          that.setData({ imageItem: _imageItem });
        }
      }
    })
  },
  // 确认上传
  updateOrderContract: function(e){
    var imageItem = this.data.imageItem;
    if (imageItem == null || imageItem.length <= 0){
      util.alert('至少上传一张图片')
      return;
    }

    var picture = '';
    for(var i=0;i<imageItem.length;i++){
      picture += imageItem[i].value + ',';
    }
    if (util.isEmpty(picture)){
      util.alert('至少上传一张图片')
      return;
    }
    picture = picture.substring(0, picture.length-1);

    var params = { open_id: app.globalData.open_id, orderID: this.data.orderID, picture: picture };
    util.httpReq("/trade/updateOrderContract", params, "POST",
      function (res) {
        var data = res.data;
        if (data.success) {
          util.alertToBack("上传合同成功");
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
  urlBind: function(e){
    this.setData({ url: this.data.url })
  }

})
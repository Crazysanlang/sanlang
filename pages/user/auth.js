var app = getApp()
var util = require('../../utils/util.js')

Page({
  data: {
    memberTypeArray: [],
    memberTypeObjArray: [],
    memberType: '',
    memberTypeId: '',
    memberTypePlaceholder: '请选择企业性质',
    tempFilePath: '',
    picLicensePath: '',
    nameValue: '',
    corpNameValue: '',
    skipAuthFlag: true
  },
  onLoad: function (options) {
    var skipAuthFlag = options.skipAuth;
    if (util.isEmpty(skipAuthFlag)) skipAuthFlag = true;
    else skipAuthFlag = false;
    this.setData({ skipAuthFlag:skipAuthFlag })
  },
  onReady: function () {
    this.memberListAjax()
  },
  // 姓名bind
  bind_name_input: function (e) {
    this.setData({ nameValue: e.detail.value })
  },
  // 企业名称bind
  bind_corpName_input: function (e) {
    this.setData({ corpNameValue: e.detail.value })
  },
  // 获取企业性质列表
  memberListAjax: function () {
    var that = this;
    util.httpReq("/bases/getMemberTypeList", "", "POST",
      function (result) {
        var data = result.data;
        if (data.success) {
          var entity = data.entity;
          var memberTypeArray = [];
          for (var i = 0; i < entity.length; i++) {
            memberTypeArray.push(entity[i].memberTypeName)
          }
          that.setData({ memberTypeArray: memberTypeArray, memberTypeObjArray: entity });
        }
        else {
          util.alert(data.message);
        }
      },
      function (result) {
        util.alert(app.globalData.failMsg);
      })
  },
  // 选择企业性质
  bindPickerChange: function (e) {
    var index = e.detail.value;
    var value = this.data.memberTypeObjArray[index].memberType;
    this.setData({ memberTypeId: value, memberType: index, memberTypePlaceholder: '' });
  },
  // 选择上传图片
  choosePicLicense: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'],      // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        // 上传图片
        wx.uploadFile({
          url: app.globalData.server + '/api/uploadFile.do',
          filePath: tempFilePaths[0],
          name: 'file',
          formData:{ type:1 },
          success: function (res1) {
            if (res1.statusCode != 200){
              util.alert("上传失败，请重新上传");
              return;
            }
            var data = JSON.parse(res1.data)
            if (data.success) {
              that.setData({ tempFilePath: tempFilePaths[0], picLicensePath: data.value });
            }
            else {
              util.alert(data.message);
            }
          }
        })
      }

    })
  },
  // 跳过认证
  skipAuth: function () {
    wx.redirectTo({ url: 'result' })
  },
  // 提交确认
  applyMember: function (e) {
    // var name = this.data.nameValue;
    // if (util.isEmpty(name)) {
    //   util.alert("请输入姓名");
    //   return;
    // }
    var corpName = this.data.corpNameValue;
    if (util.isEmpty(corpName)) {
      util.alert("请输入企业全称");
      return;
    }
    var memberType = this.data.memberTypeId;
    if (util.isEmpty(memberType)) {
      util.alert("请选择企业性质");
      return;
    }
    var picLicense = this.data.picLicensePath;
    if (util.isEmpty(picLicense)) {
      util.alert("请上传营业执照");
      return;
    }
    var that = this;
    var params = {
      corpName: corpName,
      memberType: memberType,
      picLicense: picLicense,
      open_id: app.globalData.open_id
    };
    util.httpReq("/reg/applyMember.do", params, "POST",
      function (result) {
        var data = result.data;
        if (data.success) {
          wx.redirectTo({ url: 'result' })
        }
        else {
          util.alert(data.message);
        }
      },
      function (result) {
        util.alert(app.globalData.failMsg);
      })
  }
})

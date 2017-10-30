var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: 
  { 
    userInfo:{},
    sexPlaceholder: '请选择性别',
    sexObjArray: [{ id: 0, name: '男' }, { id: 1, name: '女' }],
    sexIndex: '',
    sexValue: '',
    birthdayPlaceholder: '请选择生日',

    userNameValue: '',
    nameValue: '',
    birthdayValue: '',
    idCodeValue: '',
    wechatValue: '',
    qqValue: '',
    addressValue: ''
  },
  onLoad:function(options) { 
    
  },
  onReady: function () {
    this.userInfoAjax()
  },
  // 获取用户信息
  userInfoAjax: function(){
    var that = this
    var params = { open_id: app.globalData.open_id };
    util.httpReq("/user/userInfo", params, "POST",
      function (res) {
        var data = res.data;
        if (data.success) {
          var entity = data.entity;
          if (entity != null){
            var user = entity.user;
            var birthday = user.birthday;
            if (!util.isEmpty(birthday))
                that.setData({ birthdayValue:user.birthday, birthdayPlaceholder:'' })
            var sex = user.sex;
            var sexObjArray = that.data.sexObjArray;
            if (sexObjArray != null && sexObjArray.length > 0){
                for (var i=0;i<sexObjArray.length;i++){
                    if (sexObjArray[i].id != sex)
                        continue;
                    that.setData({ sexIndex:i, sexValue:sexObjArray[i].id, sexPlaceholder:'' })
                }
            }
            that.setData({ userInfo:user, userNameValue:user.userName, nameValue:user.name, idCodeValue:user.idCode, wechatValue:user.wechat, qqValue:user.qq, addressValue:user.address })
          }
        }
        else{
          if (util.loginAuthToLogin(data.code)) 
            return;
          util.alert(data.message);
        }
      },
      function (res) {
        util.alert(app.globalData.failMsg);
      });
  },
  // 企业类型选择
  sexChange: function(e){
    var index = e.detail.value;
    var value = this.data.sexObjArray[index].id;
    this.setData({sexIndex:index, sexValue:value, sexPlaceholder: ''})
  },
  userNameBind: function(e){
    this.setData({ userNameValue: e.detail.value })
  },
  nameBind: function(e){
    this.setData({ nameValue: e.detail.value })
  },
  bindBirthdayChange: function(e){
      var birthday = e.detail.value
      if (util.isEmpty(birthday))
        return;
      var userInfo = this.data.userInfo;
      userInfo.birthday = birthday;
      this.setData({ userInfo: userInfo, birthdayPlaceholder: '' })
  },
  idCodeBind: function(e){
    this.setData({ idCodeValue: e.detail.value })
  },
  wechatBind: function(e){
    this.setData({ wechatValue: e.detail.value })
  },
  qqBind: function(e){
    this.setData({ qqValue: e.detail.value })
  },
  addressBind: function(e){
    this.setData({ addressValue: e.detail.value })
  },
  // 更新用户信息
  updateUser: function(e){
    var userName = this.data.userNameValue;
    var name = this.data.nameValue;
    var idCode = this.data.idCodeValue;
    if (!util.isEmpty(idCode))
    {
        if (!util.isCardNo(idCode)){
            util.alert('身份证号有误，请重新输入')
            return;
        }
    }
    var wechat = this.data.wechatValue;
    var qq = this.data.qqValue;
    var address = this.data.addressValue;
    var sex = this.data.sexValue;

    var userInfo = this.data.userInfo;
    if (userInfo == null)
    {
      util.alertToBack('网络异常，请稍后再试');
      return;
    }

    userInfo.userName = userName;
    userInfo.name = name;
    userInfo.idCode = idCode;
    userInfo.wechat = wechat;
    userInfo.qq = qq;
    userInfo.address = address;
    if (!util.isEmpty(sex + ''))
        userInfo.sex = sex;

    var params = { open_id: app.globalData.open_id, userInfo:JSON.stringify(userInfo) };
    util.httpReq("/user/updateUser", params, "POST",
      function (result) {
        var data = result.data
        if (data.success) {
          util.alertToBack("修改成功");
        }
        else 
        {
          if (util.loginAuthToLogin(data.code)) 
            return;
          util.alert(data.message);
        }
      },
      function (result) {
        util.alert(app.globalData.failMsg);
      })
  }
})

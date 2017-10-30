var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: 
  { 
    userInfo:{},
    memberTypePlaceholder: '请选择公司类型',
    memberTypeObjArray: [],
    memberTypeIndex: '',
    memberTypeValue: '',

    corpNameValue: '',
    faxValue: '',
    emailValue: '',
  },
  onLoad:function(options) { 
  },
  onReady: function () {
    this.memberTypeList()
    this.userInfoAjax()
  },
  // 获取企业类型
  memberTypeList: function(){
    var that = this
    var params = { open_id: app.globalData.open_id };
    util.httpReq("/bases/getMemberTypeList", params, "POST",
      function (res) {
        var data = res.data;
        if (data.success) {
          var entity = data.entity;
          if (entity != null)
            that.setData({ memberTypeObjArray: entity })
        }
        else{
          util.alert(data.message);
        }
      },
      function (res) {
        util.alert(app.globalData.failMsg);
      });
  },
  // 获取会员级别
  getMemberLevel: function(userInfo){
    var that = this
    var params = { open_id: app.globalData.open_id, memberLevel:userInfo.member.memberLevel };
    util.httpReq("/bases/getMemberLevel", params, "POST",
      function (res) {
        var data = res.data;
        if (data.success) {
          var entity = data.entity;
          if (entity != null)
          {
            userInfo.member.memberLevelName = entity.memberLevelName;
            var memberType = userInfo.member.memberType;
            var memberTypeObjArray = that.data.memberTypeObjArray
            if (memberTypeObjArray != null && memberTypeObjArray.length > 0){
              for(var i=0;i<memberTypeObjArray.length;i++){
                if (memberTypeObjArray[i].memberType != memberType)
                  continue;
                that.setData({memberTypeIndex:i, memberTypeValue:memberTypeObjArray[i].memberType, memberTypePlaceholder: ''})
              }
            }
            that.setData({ userInfo: userInfo, corpNameValue: userInfo.member.corpName, faxValue: userInfo.member.fax, emailValue: userInfo.member.email })
          }
        }
        else{
          util.alert(data.message);
        }
      },
      function (res) {
        util.alert(app.globalData.failMsg);
      });
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
            that.getMemberLevel(entity)
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
  memberTypeChange: function(e){
    var index = e.detail.value;
    var value = this.data.memberTypeObjArray[index].memberType;
    this.setData({memberTypeIndex:index, memberTypeValue:value, memberTypePlaceholder: ''})
  },
  corpNameBind: function(e){
    this.setData({ corpNameValue: e.detail.value })
  },
  faxBind: function(e){
    this.setData({ faxValue: e.detail.value })
  },
  emailBind: function(e){
    this.setData({ emailValue: e.detail.value })
  },
  // 更新企业信息
  updateMember: function(e){
    var corpName = this.data.corpNameValue;
    if (util.isEmpty(corpName))
    {
      util.alert('请输入公司简称');
      return;
    }
    var memberType = this.data.memberTypeValue;
    var fax = this.data.faxValue;
    var email = this.data.emailValue;
    var memberInfo = this.data.userInfo.member;
    if (memberInfo == null)
    {
      util.alertToBack('网络异常，请稍后再试');
      return;
    }
    memberInfo.corpName = corpName;
    memberInfo.memberType = memberType;
    memberInfo.fax = fax;
    memberInfo.email = email;

    var params = { open_id: app.globalData.open_id, memberInfo:JSON.stringify(memberInfo) };
    util.httpReq("/user/updateMember", params, "POST",
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

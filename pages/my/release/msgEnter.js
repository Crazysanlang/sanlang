// pages/my/release/msgEnter.js

var app = getApp()
var util = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiIndex: [0, 0],
    gradePlaceholder: '请选择等级',
    gradeIndex: '',
    gradeValue: '',
    gradeArray: [{ id: 0, name: '一等品', value: 10 }, { id: 1, name: '二等品', value: 11 }, { id: 2, name: '三等品', value: 12 }, { id: 3, name: '四等品', value: 13 }, { id: 4, name: '五等品', value: 14 }],

    breedPlaceholder: '请选择品种',
    breedIndex: '',
    breedValue: '',
    breedArray: [],
    breedValue1: '',

    yearPlaceholder: '请选择年份',
    yearIndex: '',
    yearValue: '',
    yearArray: [{ id: 2017, name: '2017' }, { id: 2016, name: '2016' }, { id: 2015, name: '2015' }, { id: 2014, name: '2014' }],

    breedName:'',//前台回填数据 品种
    gradeName:'',//等级
    cottonType:'', //传到后台 品种

    impurity:'',//含杂率
    moisture:'',//不完善率
    decay:'',//霉变率
    weight:'',//容重率

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getBreedArray();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },
  //品种选择
  breedChange: function (e) {
    this.setData({ breedPlaceholder: '' })
    var value = new Array();
    value = e.detail.value;
    this.setData({
      multiIndex: value
    })
    var multiIndex = new Array();
    multiIndex = this.data.multiIndex;
    var breedArray = this.data.breedArray;
    this.setData({ breedValue: breedArray[0][multiIndex[0]].cottonTypeName })
    this.setData({ breedValue1: breedArray[1][multiIndex[1]].cottonTypeName })
    this.data.cottonType = breedArray[1][multiIndex[1]].cottonType;
    this.data.breedName = this.data.breedValue + '' + this.data.breedValue1;
  },
  //等级选择
  gradeChange: function (e) {
    var index = e.detail.value;
    var value = this.data.gradeArray[index].value;
    var name = this.data.gradeArray[index].name;
    this.setData({ gradeIndex: index, gradeValue: value, gradePlaceholder: '' });
    this.data.gradeName = name;
  },



  yearChange: function (e) {
    console.log(e)
    var index = e.detail.value;
    var value = this.data.yearArray[index].id;
    this.setData({ yearIndex: index, yearValue: value, yearPlaceholder: '' });
    
  },


  //一级品种
  getBreedArray: function () {
    var breedArray2 = new Array(); //二维数组
    var that = this;
    var params = { open_id: app.globalData.open_id };
    util.httpReq("/bases/getCottonTypeOneList", params, "POST",
      function (res) {
        if (res.data.success) {
          var list = res.data.list;
          var breedArray = new Array();
          for (var i = 0; i < list.length; i++) {
            breedArray[i] = list[i];
          }
          breedArray2[0] = breedArray


          var params1 = { open_id: app.globalData.open_id, cottonType: 1 };
          util.httpReq("/bases/getCottonTypeTwoList", params1, "POST",
            function (res) {
              var data = res.data;
              if (data.success) {
                var list = data.list;
                var breedArrayTwo = new Array(); //二维数组的第二个参数
                for (var i = 0; i < list.length; i++) {
                  breedArrayTwo[i] = list[i];
                }
                breedArray2[1] = breedArrayTwo;
                that.setData({ breedArray: breedArray2 })
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

        } else {
          util.alert(data.message);
        }
      }, function (res) { });

  },
  bindMultiPickerColumnChange: function (e) {
    var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)

    if (e.detail.column == 0) {
      var value1 = e.detail.value;
      value1 = value1 + 1;
      var params1 = { open_id: app.globalData.open_id, cottonType: value1 };
      util.httpReq("/bases/getCottonTypeTwoList", params1, "POST",
        function (res) {
          var data = res.data;
          if (data.success) {
            var list = data.list;
            var breedArrayTwo = new Array(); //二维数组的第二个参数
            for (var i = 0; i < list.length; i++) {
              breedArrayTwo[i] = list[i];
            }
            var breedArray2 = that.data.breedArray;
            breedArray2[1] = breedArrayTwo;
            that.setData({ breedArray: breedArray2 })
          }
          else {
            if (util.loginAuthToLogin(data.code))
              return;
            util.alert(data.message);
          }
        },
        function (res) { });

    }


  },
//含杂率
  impurit: function (e) {
    this.setData({
      impurity: e.detail.value
    })
   
  },
  
  //不完善率
  water: function (e) {
    this.setData({
      moisture: e.detail.value
    })
  
  },

//霉变率
  decay: function (e) {
    this.setData({
      decay: e.detail.value
    })
    app.globalData.trdlist.decay = this.data.decay;
  },

//容重(g/L)
  weight: function (e) {
    this.setData({
      moisture: e.detail.value
    })
    app.globalData.trdlist.weight = this.data.moisture;
  },

  toBlack:function(){
    
  var gradeValue = this.data.gradeValue;
  if(util.isEmpty(gradeValue)) {
    util.alert("请选择等级");
    return;
  }
  var yearValue = this.data.yearValue;
  if (util.isEmpty(yearValue)) {
    util.alert("请选择生产年份");
    return;
  }
  var impurity = this.data.impurity;
  if (!util.isEmpty(impurity)) {
    app.globalData.trdlist.impurity = this.data.impurity;
    app.globalData.trdListBean.impurity = this.data.impurity;
  }
  var moisture = this.data.moisture;
  if (!util.isEmpty(moisture)) {
    app.globalData.trdlist.water = this.data.moisture;
    app.globalData.trdListBean.water = this.data.moisture;
  }
  var decay = this.data.decay;
  if (!util.isEmpty(decay)) {
    app.globalData.trdlist.decay = this.data.decay;
    app.globalData.trdListBean.decay = this.data.decay;
  }
  var weight = this.data.weight;
  if (!util.isEmpty(weight)) {
    app.globalData.trdlist.weight = this.data.weight;
    app.globalData.trdListBean.weight = this.data.weight;
  }
  app.globalData.trdlist.cottonYear = yearValue; //年份
  //app.globalData.trdlist.cottonType = cottonType; //品种
  app.globalData.trdlist.primaryLength = gradeValue; //等级

  app.globalData.trdListBean.cottonYear = yearValue;
  app.globalData.trdListBean.breedName = this.data.breedName;
  app.globalData.trdListBean.gradeName = this.data.gradeName;

  wx.navigateBack({});
  }

})
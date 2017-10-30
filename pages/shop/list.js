var app = getApp()
var util = require('../../utils/util.js')

Page({
  data: {
    firstDataFlag: true,
    items: [],
    itemsLength: 0,
    pageNum: 1,
    moreFlag: false,
    windowHeight: 0,

    lx_items_list: [],
    ysj_items_list: [],
    mhlx_items_list: [],
    year_items_list: [],
    city_items_list: [],
    order_items_list: [],

    lxopen: false,
    lxshow: true,
    ysjopen: false,
    ysjshow: true,
    mhlxopen: false,
    mhlxshow: true,
    orderopen: false,
    ordershow: true,
    moreopen: false,
    moreshow: true,
    isfull: false,
    citycenter: {},
    cityright: {},
    select1: '',
    select2: '',
    shownavindex: '',

    lxClass: '',
    ysjClass: '',
    mhlxClass: '',
    moreClass: '',
    orderClass: '',

    lengthValue: 0,
    strongValue: 0,
    mikeValue: 0,
    impurityValue: 0,
    moistureValue: 0,
    neatValue: 77,

    shareParams: ''
  },
  onLoad: function (options) {

    this.listingCity();
    this.listingData();

    this.setData({
      lx_items_list: [{ id: 0, name: '不限', flag: true, filter: '', value: '' }, { id: 1, name: '稻谷', flag: false, filter: 'cottonType', value: 10 }, { id: 2, name: '麦子', flag: false, filter: 'cottonType', value: 11 }, { id: 3, name: '大豆', flag: false, filter: 'cottonType', value: 12 }, { id: 4, name: '玉米', flag: false, filter: 'cottonType', value: 13 }, { id: 5, name: '薯类', flag: false, filter: 'cottonType', value: 14 }],

      ysj_items_list: [{ id: 0, name: '不限', flag: true, filter: '', value: '' }, { id: 1, name: '香米', flag: false, filter: 'primaryColor', value: 10 }, { id: 2, name: '糯米', flag: false, filter: 'primaryColor', value: 11 }, { id: 3, name: '黑米', flag: false, filter: 'primaryColor', value: 12 }],

      mhlx_items_list: [{ id: 1, name: '一等品', flag: false, filter: 'primaryLength', value: 1 }, { id: 2, name: '二等品', flag: false, filter: 'primaryLength', value: 2 }, { id: 3, name: '三等品', flag: false, filter: 'primaryLength', value: 3 }, { id: 4, name: '四等品', flag: false, filter: 'primaryLength', value: 4 }, { id: 5, name: '五等品', flag: false, filter: 'primaryLength', value: 5 }],

      order_items_list: [{ id: 0, name: '默认排序', temp: '默认排序', flag: true, filter: '', value: '' }, { id: 1, name: '含杂率', temp: '含杂率', flag: false, filter: 'impurity', value: 'desc' }, { id: 2, name: '含水率', temp: '含水率', flag: false, filter: 'moisture', value: 'desc' }, { id: 3, name: '价格', temp: '价格', flag: false, filter: 'price', value:'desc' }]
    })

    // var shareParams = options.shareParams;
    // if (!util.isEmpty(shareParams))
    // {
    //   this.setData({ shareParams:shareParams })
    //   var params = {}
    //   var listingType = options.listingType;
    //   if (!util.isEmpty(listingType)){
    //     params.listingType = listingType;
    //     this.setLxItemsList('listingType', listingType);
    //   }

    //   var listingIndex = options.listingIndex;
    //   if(!util.isEmpty(listingIndex)){
    //     params.listingIndex = listingIndex;
    //     this.setLxItemsList('listingIndex', listingIndex);
    //   }


    //   var d28 = options.d28;
    //   if (!util.isEmpty(d28)){
    //     params.d28 = d28;
    //     this.setLxItemsList('d28', d28);
    //   }

    //   var d29 = options.d29;
    //   if (!util.isEmpty(d29)){
    //     params.d29 = d29;
    //     this.setLxItemsList('d29', d29);
    //   }

    //   var cottonSource = options.cottonSource;
    //   if (!util.isEmpty(cottonSource)){
    //     params.cottonSource = cottonSource;
    //     this.setLxItemsList('cottonSource', cottonSource);
    //   }

    //   var primaryColor = options.primaryColor;
    //   if (!util.isEmpty(primaryColor)){
    //     params.primaryColor = primaryColor;
    //     this.setYsjItemsList('primaryColor', primaryColor)
    //   }
      
    //   var cottonType = options.cottonType;
    //   if (!util.isEmpty(cottonType)){
    //     params.cottonType = cottonType;
    //     this.setMhlxItemsList('cottonType', cottonType)
    //   }
      
    //   var order = options.order;
    //   if (!util.isEmpty(order)){
    //     var asc = options.asc;
    //     if (util.isEmpty(asc)) 
    //       asc = 'desc';

    //     params.order = order;
    //     this.setOrderItemsList(order, asc)
    //   }
    //   else{
    //     params.order = 'price';
    //     params.asc = 'desc';
    //   }
      
    //   var cottonYear = options.cottonYear;
    //   if (!util.isEmpty(cottonYear)){
    //     params.cottonYear = cottonYear;
    //     this.setYearItemsList('cottonYear', cottonYear)
    //   }

    //   var depositary = options.depositary;
    //   if (!util.isEmpty(depositary)){
    //     params.depositary = util.decodeChar(depositary);
    //     this.setCityItemsList('depositary', depositary);
    //   }
      
    //   var lengthMin = options.lengthMin;
    //   if (!util.isEmpty(lengthMin)){
    //     params.lengthMin = lengthMin;
    //     params.lengthMax = 31;
    //     this.setLengthBind(lengthMin)
    //   }
      
    //   var strongMin = options.strongMin;
    //   if (!util.isEmpty(strongMin)){
    //     params.strongMin = strongMin;
    //     params.strongMax = 31;
    //     this.setStrongBind(strongMin)
    //   }
      
    //   var mikeMin = options.mikeMin;
    //   if (!util.isEmpty(mikeMin)){
    //     params.mikeMin = mikeMin;
    //     params.mikeMax = 6;
    //     this.setMikeBind(mikeMin)
    //   }
      
    //   var impurityMax = options.impurityMax;
    //   if (!util.isEmpty(impurityMax)){
    //     params.impurityMin = 0;
    //     params.impurityMax = impurityMax;
    //     this.setImpurityBind(impurityMax)
    //   }
      
    //   var moistureMax = options.moistureMax;
    //   if (!util.isEmpty(moistureMax)){
    //     params.moistureMin = 4;
    //     params.moistureMax = moistureMax;
    //     this.setMoistureBind(moistureMax)
    //   }
      
    //   var neatMin = options.neatMin;
    //   if (!util.isEmpty(neatMin)){
    //     params.neatMin = neatMin;
    //     params.neatMax = 99;
    //     this.setNeatBind(neatMin)
    //   }
    //   this.listingListAjaxSearch(params)
    // }
  },
  onReady: function () {
    if (util.isEmpty(this.data.shareParams))
      this.listingListAjax();
    
    this.setData({ windowHeight: app.globalData.windowHeight })
  },
  // 挂牌筛选城市
  listingCity: function(){
    var that = this;
    util.httpReq("/bases/getListingCity", {}, "POST",
      function (result) {
        var data = result.data
        if (data.success) {
          var list = data.entity;
          if (list != null && list.length > 0)
            list.unshift({ id: 0, name: '不限', flag: true, filter: '', value:'' });
          that.setData({city_items_list: list})
        }
      },
      function (result) {
        util.alert(app.globalData.failMsg);
      })
  },
  // 挂牌筛选日期
  listingData:function(){
    var that = this;
    util.httpReq("/bases/getListingData", {}, "POST",
      function (result) {
        var data = result.data
        if (data.success) {
          that.setData({year_items_list: data.entity})
        }
      },
      function (result) {
        util.alert(app.globalData.failMsg);
      })
  },
  // 推荐资源
  listingListAjax: function () {
    var pageNum = this.data.pageNum;
    if (pageNum == 1)
      this.setData({ firstDataFlag: true })
    this.setData({ moreFlag: false })
    var that = this;
    var params = { pageNum: pageNum, open_id: app.globalData.open_id };
    
    // 类型选择
    var cottonType = '';
    var lx_items_list = this.data.lx_items_list;
    for (var i=0;i<lx_items_list.length;i++){
      if (!lx_items_list[i].flag)
        continue;
      var filter = lx_items_list[i].filter;
      var value = lx_items_list[i].value;
      if (filter == 'cottonType')
        cottonType += value + ",";
    }
    if (!util.isEmpty(cottonType))
      params.cottonType = cottonType.substring(0, cottonType.length - 1);

    // 颜色级
    var primaryColor = '';
    var ysj_items_list = this.data.ysj_items_list;
    for (var i=0;i<ysj_items_list.length;i++){
      if (!ysj_items_list[i].flag)
        continue;
      var filter = ysj_items_list[i].filter;
      var value = ysj_items_list[i].value;
      if (filter == 'primaryColor')
        primaryColor += value + ',';
    }
    if (!util.isEmpty(primaryColor))
      params.primaryColor = primaryColor.substring(0, primaryColor.length-1);

    // // 棉花类型
    var primaryLength = '';
    var mhlx_items_list = this.data.mhlx_items_list;
    for (var i=0;i<mhlx_items_list.length;i++){
      if (!mhlx_items_list[i].flag)
        continue;
      var filter = mhlx_items_list[i].filter;
      var value = mhlx_items_list[i].value;
      if (filter == 'primaryLength')
        primaryLength += value + ',';
    }
    if (!util.isEmpty(primaryLength))
      params.primaryLength = primaryLength.substring(0, primaryLength.length-1);

    // 排序
    var order_items_list = this.data.order_items_list;
    for (var i=1;i<order_items_list.length;i++){
      if (!order_items_list[i].flag)
        continue;
      params.order = order_items_list[i].filter;
      params.asc = order_items_list[i].value;
    }

    // 年份选择
    var cottonYear = '';
    var year_items_list = this.data.year_items_list;
    for (var i=0;i<year_items_list.length;i++){
      if (!year_items_list[i].flag)
        continue;
      var filter = year_items_list[i].filter;
      var value = year_items_list[i].value;
      if (filter == 'cottonYear')
        cottonYear += value + ',';
    }
    if (!util.isEmpty(cottonYear))
      params.cottonYear = cottonYear.substring(0, cottonYear.length-1);

    // 城市选择
    var depositary = '';
    var city_items_list = this.data.city_items_list;
    for (var i=0;i<city_items_list.length;i++){
      if (!city_items_list[i].flag)
        continue;
      var filter = city_items_list[i].filter;
      var value = city_items_list[i].value;
      if (filter == 'depositary')
        depositary += value + ',';
    }
    if (!util.isEmpty(depositary))
      params.depositary = depositary.substring(0, depositary.length-1);

    // 含杂
    var impurityValue = this.data.impurityValue;
    if (impurityValue > 0){
      params.impurityMin = 0;
      params.impurityMax = impurityValue;
    }
    // 回潮
    var moistureValue = this.data.moistureValue;
    if (moistureValue > 0){
      params.moistureMin = 0;
      params.moistureMax = moistureValue;
    }
    
    console.log("params：" + JSON.stringify(params))
    
    util.showLoading()
    util.httpReq("/listing/getListingList", params, "POST",
      function (result) {
        var data = result.data
        if (data.success) {
          var entity = data.entity;
          var totalPage = entity.totalPage;
          // 总页数大于当前页，则有更多按钮
          if (totalPage > pageNum)
            that.setData({ moreFlag: true })
          var list = entity.list;
          if (pageNum == 1)
            that.setData({ items: list, itemsLength: list.length })
          else
            that.setData({ items: that.data.items.concat(list) }) // 添加列表元素
        }
        else {
          util.alert(data.message);
        }
        that.setData({ firstDataFlag: false })
        wx.stopPullDownRefresh();
        util.hideLoading()
      },
      function (result) {
        util.alert(app.globalData.failMsg);
        util.hideLoading()
      })
  },
  // 去详情
  cottonDetail: function (e) {
    wx.navigateTo({ url: '../shop/batchDetail?batchID=' + e.currentTarget.id })
  },
  // 更多
  moreList: function () {
    var pageNum = this.data.pageNum;
    this.setData({ pageNum: pageNum + 1 })
    this.listingListAjax()
  },
  // 搜索批次
  toShopSearch: function (e) {
    wx.navigateTo({ url: '/pages/shop/search' })
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({ pageNum: 1 })
    this.listingListAjax()
  },
  initListData: function (flag) {
    if (flag) {
      this.setData({
        lxopen: false,
        lxshow: false,
        ysjopen: false,
        mhlxopen: false,
        orderopen: false,
        moreopen: false,
        isfull: false,
        shownavindex: 0
      })
    }
    else {
      this.setData({
        lxopen: false,
        lxshow: true,
        ysjopen: false,
        ysjshow: true,
        mhlxopen: false,
        mhlxshow: true,
        orderopen: false,
        ordershow: true,
        moreopen: false,
        moreshow: true,
        isfull: true
      })
    }
  },
  lista: function (e) {
    if (this.data.lxopen) {
      this.initListData(true)
      this.setData({ lxshow: true })
    }
    else {
      this.initListData(false)
      this.setData({ lxopen: true, lxshow: false, shownavindex: e.currentTarget.dataset.nav })
    }
  },
  listb: function (e) {
    if (this.data.ysjopen) {
      this.initListData(true)
      this.setData({ ysjshow: true })
    } else {
      this.initListData(false)
      this.setData({ ysjopen: true, ysjshow: false, shownavindex: e.currentTarget.dataset.nav })
    }
  },
  listc: function (e) {
    if (this.data.mhlxopen) {
      this.initListData(true)
      this.setData({ mhlxshow: true })
    } else {
      this.initListData(false)
      this.setData({ mhlxopen: true, mhlxshow: false, shownavindex: e.currentTarget.dataset.nav })
    }
  },
  listd: function (e) {
    if (this.data.orderopen) {
      this.initListData(true)
      this.setData({ ordershow: true })
    } else {
      this.initListData(false)
      this.setData({ orderopen: true, ordershow: false, shownavindex: e.currentTarget.dataset.nav })
    }
  },
  listf: function (e) {
    if (this.data.moreopen) {
      this.initListData(true)
      this.setData({ moreshow: true })
    } else {
      this.initListData(false)
      this.setData({ moreopen: true, moreshow: false, shownavindex: e.currentTarget.dataset.nav })
    }
  },
  hidebg: function (e) {
    this.setData({
      lxopen: false,
      lxshow: true,
      ysjopen: false,
      ysjshow: true,
      mhlxopen: false,
      mhlxshow: true,
      orderopen: false,
      ordershow: true,
      moreopen: false,
      moreshow: true,
      isfull: false,
      shownavindex: 0
    })
  },
  // 类型选择
  choose_lx_item: function (e) {
    var id = e.currentTarget.id;
    var flagIndex = 0;
    var lx_items_list = this.data.lx_items_list;
    if (id == 0){
      for (var i=0;i<lx_items_list.length;i++){
        if (lx_items_list[i].id == 0)
          lx_items_list[i].flag = true;
        else
          lx_items_list[i].flag = false;
      }
    }
    else{
      lx_items_list[0].flag = false;
      for (var i=1;i<lx_items_list.length;i++){
        if (id == lx_items_list[i].id)
        {
          if (lx_items_list[i].flag){
            lx_items_list[i].flag = false;
          }
          else{
            lx_items_list[i].flag = true;
          }
        }
        if (lx_items_list[i].flag)
          flagIndex++;
      }
    }
    if (flagIndex == 0){
      lx_items_list[0].flag = true;
      this.setData({ lxClass: '' })
    }else{
      this.setData({ lxClass: 'on' })
    }

    this.initListData(true)
    this.setData({ lx_items_list:lx_items_list, lxshow: true, pageNum: 1 })
    this.listingListAjax()
  },
  // 颜色级选择
  choose_ysj_item: function (e) {
    var id = e.currentTarget.id;
    var flagIndex = 0;
    var ysj_items_list = this.data.ysj_items_list;
    if (id == 0){
      for (var i=0;i<ysj_items_list.length;i++){
        if (ysj_items_list[i].id == 0)
          ysj_items_list[i].flag = true;
        else
          ysj_items_list[i].flag = false;
      }
    }
    else{
      ysj_items_list[0].flag = false;
      for (var i=1;i<ysj_items_list.length;i++){
        if (id == ysj_items_list[i].id)
        {
          if (ysj_items_list[i].flag){
            ysj_items_list[i].flag = false;
          }
          else{
            ysj_items_list[i].flag = true;
          }
        }
        if (ysj_items_list[i].flag)
          flagIndex++;
      }
    }
    if (flagIndex == 0){
      ysj_items_list[0].flag = true;
      this.setData({ ysjClass: '' })
    }else{
      this.setData({ ysjClass: 'on' })
    }

    this.initListData(true)
    this.setData({ ysj_items_list:ysj_items_list, ysjshow: true, pageNum: 1 })
    this.listingListAjax()
  },
  // 选择排序
  choose_order_item: function(e){
    var id = e.currentTarget.id;
    if (id == 0){
      this.setData({ orderClass: '' })
    }
    else{
      this.setData({ orderClass: 'on' })
    }

    var order_items_list = this.data.order_items_list;
    for (var i=0;i<order_items_list.length;i++){
      if (id == order_items_list[i].id)
      {
        order_items_list[i].flag = true;
        if (id == 0)
          continue;
        var value = order_items_list[i].value;
        if (value == 'desc'){
          order_items_list[i].value = 'asc';
          order_items_list[i].name = order_items_list[i].temp + ' (从低到高)';
        }else{
          order_items_list[i].value = 'desc';
          order_items_list[i].name = order_items_list[i].temp + ' (从高到低)';
        }
      }
      else
      {
        order_items_list[i].name = order_items_list[i].temp;
        order_items_list[i].flag = false;
      }
    }
    
    this.initListData(true)
    this.setData({ order_items_list:order_items_list, ordershow: true, pageNum: 1})
    this.listingListAjax()
  },
  // 选择城市
  choose_city_item: function(e){
    var id = e.currentTarget.id;
    var flagIndex = 0;
    var city_items_list = this.data.city_items_list;
    if (id == 0){
      for (var i=0;i<city_items_list.length;i++){
        if (city_items_list[i].id == 0)
          city_items_list[i].flag = true;
        else
          city_items_list[i].flag = false;
      }
    }
    else{
      city_items_list[0].flag = false;
      for (var i=1;i<city_items_list.length;i++){
        if (id == city_items_list[i].id)
        {
          if (city_items_list[i].flag){
            city_items_list[i].flag = false;
          }
          else{
            city_items_list[i].flag = true;
          }
        }
        if (city_items_list[i].flag)
          flagIndex++;
      }
    }
    if (flagIndex == 0){
      city_items_list[0].flag = true;
      this.setData({ mhlxClass: '' })
    }else{
      this.setData({ mhlxClass: 'on' })
    }

    this.initListData(true)
    this.setData({ city_items_list:city_items_list, mhlxshow: true, pageNum: 1 })
    this.listingListAjax()
  },
  // 选择年份
  choose_year_item: function(e){
    var id = e.currentTarget.id;
    var year_items_list = this.data.year_items_list;
    for (var i=0;i<year_items_list.length;i++){
      if (id == year_items_list[i].id)
      {
        if (year_items_list[i].flag){
          year_items_list[i].flag = false;
        }
        else{
          year_items_list[i].flag = true;
        }
      }
    }
    this.setData({ year_items_list:year_items_list})
    this.searchForm()
  },
  // 棉花类型选择
  choose_mhlx_item: function (e) {
    var id = e.currentTarget.id;
    var mhlx_items_list = this.data.mhlx_items_list;
    for (var i=0;i<mhlx_items_list.length;i++){
      if (id == mhlx_items_list[i].id)
      {
        if (mhlx_items_list[i].flag){
          mhlx_items_list[i].flag = false;
        }
        else{
          mhlx_items_list[i].flag = true;
        }
      }
    }
    this.setData({ mhlx_items_list:mhlx_items_list})
    this.searchForm()
  },
  // 清空
  clearSearchValue:function(e){
    var year_items_list = this.data.year_items_list;
    for (var i=0;i<year_items_list.length;i++)
      year_items_list[i].flag = false;
    
    var mhlx_items_list = this.data.mhlx_items_list;
    for (var i=0;i<mhlx_items_list.length;i++)
      mhlx_items_list[i].flag = false;

    this.setData({ mhlx_items_list:mhlx_items_list, year_items_list:year_items_list, lengthValue: 0, strongValue: 0, mikeValue: 0, impurityValue: 0, moistureValue: 0, neatValue: 77})

    this.searchForm()
  },
  // 提交筛选
  searchForm: function(){
    this.setData({ moreClass: '' })
    if (this.data.lengthValue > 26)
      this.setData({ moreClass: 'on' })
    if (this.data.strongValue > 26)
      this.setData({ moreClass: 'on' })
    if (this.data.mikeValue > 0)
      this.setData({ moreClass: 'on' })
    if (this.data.impurityValue < 5)
      this.setData({ moreClass: 'on' })
    if (this.data.moistureValue < 11)
      this.setData({ moreClass: 'on' })
    if (this.data.neatValue > 77)
      this.setData({ moreClass: 'on' })
    var mhlx_items_list = this.data.mhlx_items_list;
    for (var i=0;i<mhlx_items_list.length;i++){
      if (mhlx_items_list[i].flag)
        this.setData({ moreClass: 'on' })
    }
    var year_items_list = this.data.year_items_list;
    for (var i=0;i<year_items_list.length;i++){
      if (year_items_list[i].flag)
        this.setData({ moreClass: 'on' })
    }
    this.setData({ pageNum: 1 })
    this.listingListAjax()
  },
  // 长度
  lengthBind: function(e){
    this.setData({ lengthValue:e.detail.value })
    this.searchForm()
  },
  // 强力
  strongBind: function(e){
    this.setData({ strongValue:e.detail.value })
    this.searchForm()
  },
  // 马值
  mikeBind: function(e){
    this.setData({ mikeValue:e.detail.value })
    this.searchForm()
  },
  // 含杂
  impurityBind: function(e){
    this.setData({ impurityValue:e.detail.value })
    this.searchForm()
  },
  // 回潮
  moistureBind: function(e){
    this.setData({ moistureValue:e.detail.value })
    this.searchForm()
  },
  // 长度整齐度
  neatBind: function(e){
    this.setData({ neatValue:e.detail.value })
    this.searchForm()
  },
  // 关闭窗口
  closeMore: function(e){
    this.initListData(true)
    this.setData({ moreshow: true, pageNum: 1 })
  },
  // 分享页面
  onShareAppMessage: function () {
    // var params = this.shareParams()
    return {
      title: '棉联商城',
      path: '/pages/shop/list',
      success: function(res) {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 1500
        })
      }
    }
  },
  // // 分享后所带参数
  // shareParams: function(){
  //   var params = '?shareParams=true';
  //   // 类型选择
  //   var listingType = '';
  //   var cottonSource = '';
  //   var lx_items_list = this.data.lx_items_list;
  //   for (var i=0;i<lx_items_list.length;i++){
  //     if (!lx_items_list[i].flag)
  //       continue;
  //     var filter = lx_items_list[i].filter;
  //     var value = lx_items_list[i].value;
  //     if (filter == 'listingType')
  //       listingType += value + ",";
  //     else if (filter == 'd28')
  //       params += '&d28=' + value;
  //     else if (filter == 'd29')
  //       params += '&d29=' + value;
  //     else if (filter == 'cottonSource')
  //       cottonSource += value + ",";
  //     else if (filter == 'listingIndex')
  //       params += '&listingIndex=' + value;
  //   }
  //   if (!util.isEmpty(listingType))
  //     params += '&listingType=' + listingType.substring(0, listingType.length-1);
  //   if (!util.isEmpty(cottonSource))
  //     params += '&cottonSource=' + cottonSource.substring(0, cottonSource.length - 1);

  //   // 颜色级
  //   var primaryColor = '';
  //   var ysj_items_list = this.data.ysj_items_list;
  //   for (var i=0;i<ysj_items_list.length;i++){
  //     if (!ysj_items_list[i].flag)
  //       continue;
  //     var filter = ysj_items_list[i].filter;
  //     var value = ysj_items_list[i].value;
  //     if (filter == 'primaryColor')
  //       primaryColor += value + ',';
  //   }
  //   if (!util.isEmpty(primaryColor))
  //     params += '&primaryColor=' + primaryColor.substring(0, primaryColor.length-1);

  //   // 棉花类型
  //   var cottonType = '';
  //   var mhlx_items_list = this.data.mhlx_items_list;
  //   for (var i=0;i<mhlx_items_list.length;i++){
  //     if (!mhlx_items_list[i].flag)
  //       continue;
  //     var filter = mhlx_items_list[i].filter;
  //     var value = mhlx_items_list[i].value;
  //     if (filter == 'cottonType')
  //       cottonType += value + ',';
  //   }
  //   if (!util.isEmpty(cottonType))
  //     params += '&cottonType=' + cottonType.substring(0, cottonType.length-1);

  //   // 排序
  //   var order_items_list = this.data.order_items_list;
  //   for (var i=1;i<order_items_list.length;i++){
  //     if (!order_items_list[i].flag)
  //       continue;
  //     params += '&order=' + order_items_list[i].filter;
  //     params += '&asc=' +  order_items_list[i].value;
  //   }

  //   // 年份选择
  //   var cottonYear = '';
  //   var year_items_list = this.data.year_items_list;
  //   for (var i=0;i<year_items_list.length;i++){
  //     if (!year_items_list[i].flag)
  //       continue;
  //     var filter = year_items_list[i].filter;
  //     var value = year_items_list[i].value;
  //     if (filter == 'cottonYear')
  //       cottonYear += value + ',';
  //   }
  //   if (!util.isEmpty(cottonYear))
  //     params += '&cottonYear=' + cottonYear.substring(0, cottonYear.length-1);

  //   // 城市选择
  //   var depositary = '';
  //   var city_items_list = this.data.city_items_list;
  //   for (var i=0;i<city_items_list.length;i++){
  //     if (!city_items_list[i].flag)
  //       continue;
  //     var filter = city_items_list[i].filter;
  //     var value = city_items_list[i].value;
  //     if (filter == 'depositary')
  //       depositary += util.encodeChar(value) + ',';
  //   }
  //   if (!util.isEmpty(depositary))
  //     params += '&depositary=' + depositary.substring(0, depositary.length-1);

  //   // 长度
  //   var lengthValue = this.data.lengthValue;
  //   if (lengthValue > 26){
  //     params += '&lengthMin=' + lengthValue;
  //   }
  //   // 强力
  //   var strongValue = this.data.strongValue;
  //   if (strongValue > 26){
  //     params += '&strongMin=' + strongValue;
  //   }
  //   // 马值
  //   var mikeValue = this.data.mikeValue;
  //   if (mikeValue > 0){
  //     params += '&mikeMin=' + mikeValue;
  //   }
  //   // 含杂
  //   var impurityValue = this.data.impurityValue;
  //   if (impurityValue < 5){
  //     params += '&impurityMax=' + impurityValue;
  //   }
  //   // 回潮
  //   var moistureValue = this.data.moistureValue;
  //   if (moistureValue < 11){
  //     params += '&moistureMax=' + moistureValue;
  //   }
  //   // 长度整齐度
  //   var neatValue = this.data.neatValue;
  //   if (neatValue > 77){
  //     params += '&neatMin=' + neatValue;
  //   }
  //   return params;
  // },
  // 带搜索条件的推荐资源
  // listingListAjaxSearch: function (params) {
  //   var pageNum = this.data.pageNum;
  //   if (pageNum == 1)
  //     this.setData({ firstDataFlag: true })
  //   this.setData({ moreFlag: false })
  //   var that = this;
  //   params.pageNum = pageNum;
  //   params.open_id = app.globalData.open_id

  //   util.showLoading()
  //   util.httpReq("/listing/getListingList", params, "POST",
  //     function (result) {
  //       var data = result.data
  //       if (data.success) {
  //         var entity = data.entity;
  //         var totalPage = entity.totalPage;
  //         // 总页数大于当前页，则有更多按钮
  //         if (totalPage > pageNum)
  //           that.setData({ moreFlag: true })
  //         var list = entity.list;
  //         if (pageNum == 1)
  //           that.setData({ items: list, itemsLength: list.length })
  //         else
  //           that.setData({ items: that.data.items.concat(list) }) // 添加列表元素
  //       }
  //       else {
  //         util.alert(data.message);
  //       }
  //       that.setData({ firstDataFlag: false })
  //       wx.stopPullDownRefresh();
  //       util.hideLoading()
  //     },
  //     function (result) {
  //       util.alert(app.globalData.failMsg);
  //       util.hideLoading()
  //     })
  // },
  // // 反向设置
  // setLxItemsList: function(text, val){
  //   var lx_items_list = this.data.lx_items_list;
  //   lx_items_list[0].flag = false;

  //   var vals = val.split(",");
  //   for (var i=1;i<lx_items_list.length;i++){
  //     var filter = lx_items_list[i].filter;
  //     var value = lx_items_list[i].value;
  //     if (filter == text && value == val){
  //       lx_items_list[i].flag = true;
  //     }

  //     if (text == 'cottonSource' || text == 'listingType'){
  //       if (vals != null && vals.length > 0){
  //         for(var z = 0; z < vals.length; z++)
  //         {
  //           if (value == vals[z])
  //             lx_items_list[i].flag = true;
  //         }
  //       }
  //     }
  //   }
  //   this.setData({ lx_items_list:lx_items_list, lxClass: 'on' })
  // },
  // setDataItemsList: function(text, val){
  //   var data_items_list = this.data.data_items_list;
  //   data_items_list[0].flag = false;
  //   var flag = false;
  //   for (var i=1;i<data_items_list.length;i++){
  //     var filter = data_items_list[i].filter;
  //     var value = data_items_list[i].value;
  //     if (filter == text && value == val){
  //       data_items_list[i].flag = true;
  //       flag = true;
  //     }
  //   }
  //   if (!flag){
  //     this.setData({ dateFlag: true, dateValue:val })
  //   }
  //   this.setData({ data_items_list:data_items_list, ysjClass: 'on' })
  // },
  // setYsjItemsList: function(text, val){
  //   var ysj_items_list = this.data.ysj_items_list;
  //   ysj_items_list[0].flag = false;
  //   var vals = val.split(",");
  //   for (var i=1;i<ysj_items_list.length;i++){
  //     var filter = ysj_items_list[i].filter;
  //     var value = ysj_items_list[i].value;
  //     if (filter == text){
  //       if (vals != null && vals.length > 0){
  //         for(var z = 0; z < vals.length; z++)
  //         {
  //           if (value == vals[z])
  //             ysj_items_list[i].flag = true;
  //         }
  //       }
  //     }
  //   }
  //   this.setData({ ysj_items_list:ysj_items_list, ysjClass: 'on' })
  // },
  // setCityItemsList: function(text, val){
  //   var that = this;
  //   setTimeout(function(){
  //     var city_items_list = that.data.city_items_list;
  //     if (city_items_list == null || city_items_list.length <= 0)
  //     {
  //       that.setCityItemsList(text, val)
  //       return;
  //     }
  //     city_items_list[0].flag = false;

  //     var vals = val.split(",");
  //     for (var i=1;i<city_items_list.length;i++){
  //       var filter = city_items_list[i].filter;
  //       var value = city_items_list[i].value;
  //       if (vals != null && vals.length > 0){
  //         for(var z = 0; z < vals.length; z++)
  //         {
  //           if (util.encodeChar(value) == vals[z])
  //             city_items_list[i].flag = true;
  //         }
  //       }
  //       else{
  //         city_items_list[i].flag = true;
  //       }
  //     }
  //     that.setData({ city_items_list:city_items_list, mhlxClass: 'on' })
  //   }, 500);
  // },
  // setOrderItemsList: function(text, asc){
  //   var order_items_list = this.data.order_items_list;
  //   order_items_list[0].flag = false;
  //   for (var i=1;i<order_items_list.length;i++){
  //     var filter = order_items_list[i].filter;
  //     var value = order_items_list[i].value;
  //     if (filter == text){
  //       order_items_list[i].flag = true;
  //       if (asc == 'desc'){
  //         order_items_list[i].value = 'desc';
  //         order_items_list[i].name = order_items_list[i].temp + ' (从高到低)';
  //       }
  //       else{
  //         order_items_list[i].value = 'asc';
  //         order_items_list[i].name = order_items_list[i].temp + ' (从低到高)';
  //       }
  //     }
  //   }
  //   this.setData({ order_items_list:order_items_list, orderClass: 'on' })
  // },
  // setLengthBind: function(value){
  //   this.setData({ lengthValue:value, moreClass: 'on' })
  // },
  // setStrongBind: function(value){
  //   this.setData({ strongValue:value, moreClass: 'on' })
  // },
  // // 马值
  // setMikeBind: function(value){
  //   this.setData({ mikeValue:value, moreClass: 'on' })
  // },
  // // 含杂
  // setImpurityBind: function(value){
  //   this.setData({ impurityValue:value, moreClass: 'on' })
  // },
  // // 回潮
  // setMoistureBind: function(value){
  //   this.setData({ moistureValue:value, moreClass: 'on' })
  // },
  // // 长度整齐度
  // setNeatBind: function(value){
  //   this.setData({ neatValue:value, moreClass: 'on' })
  // },
  // setMhlxItemsList: function(text, val){
  //   var mhlx_items_list = this.data.mhlx_items_list;
  //   var vals = val.split(",");
  //   for (var i=0;i<mhlx_items_list.length;i++){
  //     var filter = mhlx_items_list[i].filter;
  //     var value = mhlx_items_list[i].value;
  //     if (filter == text){
  //       if (vals != null && vals.length > 0){
  //         for(var z = 0; z < vals.length; z++)
  //         {
  //           if (value == vals[z])
  //             mhlx_items_list[i].flag = true;
  //         }
  //       }
  //     }
  //   }
  //   this.setData({ mhlx_items_list:mhlx_items_list, moreClass: 'on' })
  // },
  // setYearItemsList: function(text, val){
  //   var that = this;
  //   setTimeout(function(){
  //     var year_items_list = that.data.year_items_list;
  //     if (year_items_list == null || year_items_list.length <= 0)
  //     {
  //       that.setYearItemsList(text, val)
  //       return;
  //     }
  //     var vals = val.split(",");
  //     for (var i=0;i<year_items_list.length;i++){
  //       var filter = year_items_list[i].filter;
  //       var value = year_items_list[i].value;
  //       if (filter == text){
  //         if (vals != null && vals.length > 0){
  //           for(var z = 0; z < vals.length; z++)
  //           {
  //             if (value == vals[z])
  //               year_items_list[i].flag = true;
  //           }
  //         }
  //       }
  //     }
  //     that.setData({ year_items_list:year_items_list, moreClass: 'on' })
  //   }, 500)
  // }

})
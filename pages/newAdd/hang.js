Page({
  data: {
    breedPlaceholder: '请选择品种',
    breedIndex: '',
    breedValue: '',
    breedArray: [{ id: 0, name: '玉米' }, { id: 1, name: '小麦' }, { id: 2, name: '水稻' }, { id: 2, name: '大豆' }],
    gradePlaceholder: '请选择等级',
    gradeIndex: '',
    gradeValue: '',
    gradeArray: [{ id: 0, name: '一等品' }, { id: 1, name: '二等品' }, { id: 2, name: '三等品' }, { id: 2, name: '四等品' }],
    indatePlaceholder: '3',
    indateIndex: '',
    indateValue: '',
    indateArray: [{ id: 0, name: '1' }, { id: 1, name: '2' }, { id: 2, name: '3' }, { id: 2, name: '4' }],
    region: ['请选择交货地'],
    customItem: '全部'
  },
  onLoad: function (options) {
  
  },
  onReady: function () {
  
  },
  onShow: function () {
  
  },
  onHide: function () {
  
  },
  onUnload: function () {
  
  },
  // 品种选择
  breedChange: function (e) {
    var index = e.detail.value;
    var value = this.data.breedArray[index].id;
    this.setData({ breedIndex: index, breedValue: value, breedPlaceholder: '' })
  },
   // 等级选择
  gradeChange: function (e) {
    var index = e.detail.value;
    var value = this.data.gradeArray[index].id;
    this.setData({ gradeIndex: index, gradeValue: value, gradePlaceholder: '' })
  },
   // 有效期
  indateChange: function (e) {
    var index = e.detail.value;
    var value = this.data.indateArray[index].id;
    this.setData({ indateIndex: index, indateValue: value, indatePlaceholder: '' })
  },
  // 存储库
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  }
})
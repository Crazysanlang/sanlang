Page({
    data: {
      yearPlaceholder: '请选择年份',
      yearIndex: '',
      yearValue: '',
      yearArray: [{ id: 0, name: '2014' }, { id: 1, name: '2015' }, { id: 2, name: '2016' }, { id: 2, name: '2017' }],
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
    yearChange: function (e) {
      console.log(e)
      var index = e.detail.value;
      var value = this.data.yearArray[index].id;
      this.setData({ yearIndex: index, yearValue: value, yearPlaceholder: '' })
    }
})
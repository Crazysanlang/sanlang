Page({
  data: {
    char_lt: "<",
    showtab: 1
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
  bindTabnav: function (e) {
    console.log(e)
    this.setData({ showtab: e.currentTarget.dataset.tabnav })
  }
})
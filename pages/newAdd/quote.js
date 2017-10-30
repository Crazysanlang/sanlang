Page({
  data: {
    showModalStatus: false,
    animationData: '',
  },
  onLoad: function () {
  
  },
  onReady: function () {
  },
  onShow: function () {
    
  },
  onHide:function () {
    
  },
  onUnload: function(){
    
  },
  // 加
  // costPlus: function (e) {
  //   var curCost = this.data.curCost;
  //   var increasePrice = this.data.increasePrice;
  //   this.setData({ curCost: (curCost + increasePrice) })
  //   if (this.data.curCost <= this.data.startPrice) {
  //     this.setData({ isClick: true })
  //   } else {
  //     this.setData({ isClick: false })
  //   }
  // },
  // 减
  // costMinus: function () {
  //   if (this.data.curCost <= this.data.startPrice)
  //     return;
  //   var curCost = this.data.curCost;
  //   var increasePrice = this.data.increasePrice;
  //   this.setData({ curCost: (curCost - increasePrice) })
  //   if (this.data.curCost <= this.data.startPrice) {
  //     this.setData({ isClick: true })
  //     this.setData({ curCost: this.data.startPrice })
  //   }
  // },
  powerDrawer: function (e) {
    console.log(e)
    var currentStatu = e.currentTarget.dataset.statu;
    this.ani(currentStatu)
  },
  ani: function (currentStatu) {
    /* 动画部分 */
    var animation = wx.createAnimation({
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });
    this.animation = animation;
    animation.opacity(0).translateY(100).step();
    this.setData({
      animationData: animation.export()
    })
    setTimeout(function () {
      animation.opacity(1).translateY(0).step();
      this.setData({ animationData: animation })
      //关闭  
      if (currentStatu == "close") {
        this.setData({ showModalStatus: false });
      }
    }.bind(this), 200)
    if (currentStatu == "open") {
      this.setData({ showModalStatus: true });
    }
  }
})
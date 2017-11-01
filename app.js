// 小程序登录-获取openid
var login = require('/utils/login.js')

App({
  onLaunch: function () {
    login.getOpenId();
    this.systemInfoSync();
  },
  onError: function (msg) {
    console.log(msg);
  },
  // 公用数据
  globalData: {
    appid: 'wxf723cb7680e854d0',
    secret: 'd0113169a4f62ceb3c2830c175ebeb05',
    failMsg: '网络异常，请稍后再试',
    server: 'https://xcx.jiheit.com/cottonWx', 
    js_code: '',
    open_id: '',
    isWxLoginComplete: false,
    latitude: 0,
    longitude: 0,
    userInfo: {},
    isLoginCode: 9999,
    loginCode_9999:9999,  // 登录
    loginCode_1125:1125,	// 用户不存在
    loginCode_1144:1144,  // 用户已冻结
    loginCode_1138:1138,	// 会员不存在
    loginCode_1147:1147,	// 未认证会员
    loginCode_1139:1139,	// 会员已冻结
    contactsItem: {},
    // 可使用窗口高度
    windowHeight: 0,
    windowWidth:0
  },
  systemInfoSync: function(){
    var that = this
    setTimeout(function(){
      try {
        var res = wx.getSystemInfoSync()
        that.globalData.screenWidth = res.windowHeight;
        // console.log('客户端平台：' + res.platform)
        // console.log('操作系统版本：' + res.system)
        // console.log('微信版本号：' + res.version)
        // console.log('手机型号：' + res.model)
        // console.log('当前高度为：' + res.windowHeight)
      } catch (e) { }
    }, 500);
    
  },
  randomUUID: function (n) {
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var res = "temp_";
    for (var i = 0; i < n; i++) {
      var id = Math.ceil(Math.random() * 35);
      res += chars[id];
    }
    return res;
  }

})
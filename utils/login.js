// 只对外开发获取openid方法
function getOpenId() {
  // login()
  if (wx.showLoading)
    wx.showLoading({ title: '加载中', mask: true })
  getOpenIdByWx();
}

// 直接通过微信api获取openid
function getOpenIdByWx() {
  wx.login({
    success: function (loginCode) {
      getApp().globalData.js_code = loginCode.code
      console.log("jscode:" + loginCode.code)
      var url = getApp().globalData.server + '/api/getOpenId';
      var params = { js_code: loginCode.code };
      wx.request({
        url: url,
        data: params,
        header: { "content-type": "application/x-www-form-urlencoded" },
        method: 'POST',
        success: function (res) {
          var data = res.data;
          if (data == null){
            loginErr();
            return;
          }

          if (data.code == 1000){
            getUserInfo(data.value);
          }
          else{
            loginErr();
          }
        },
        fail: function (res) {
          loginErr();
        }
      })
    }
  })
}

// 获取js_code
function login() {
  wx.showToast({ title: '加载中', icon: 'loading', duration: 10000 });
  wx.login({
    success: function (res) {
      if (res.code) {
        getApp().globalData.js_code = res.code
        getSessionId(res.code);
      } else {
        loginErr();
      }
    }
  });
}

// 获取sessionId
function getSessionId(js_code) {
  wx.request({
    url: getApp().globalData.server + '/api/getSession',
    data: { js_code: js_code },
    header: { "content-type": "application/x-www-form-urlencoded" },
    method: 'POST',
    success: function (res) {
      if (res.data.success) {
        wx.setStorageSync('sessionId', res.data.value)
        getUserInfo()
      }
      else {
        loginErr();
      }
    },
    fail: function (res) {
      loginErr();
    }
  });
}

// // 获取
// function getUserInfo() {
//   wx.getUserInfo({
//     success: function (res) {
//       getApp().globalData.userInfo = res.userInfo
//       // 解密用户敏感数据
//       wx.request({
//         url: getApp().globalData.server + '/api/decodeUserInfo',
//         data: {
//           encryptedData: res.encryptedData,
//           iv: res.iv,
//           sessionId: wx.getStorageSync('sessionId')
//         },
//         method: 'POST',
//         header: { "content-type": "application/x-www-form-urlencoded" },
//         success: function (res) {
//           var data = JSON.parse(res.data.value);
//           // var unionId = data.unionId
//           wxLogin(data.openId);
//         },
//         fail: function (res) {
//           loginErr()
//         }
//       });
//     },
//     fail: function (res) {
//       loginErr();
//     }
//   });
// }

// 获取用户信息
function getUserInfo(openId) {
  wx.getUserInfo({
    success: function (res) {
      getApp().globalData.userInfo = res.userInfo
    },
    fail: function (res) {
      loginErr();
    },
    complete: function(e){
      wxLogin(openId);
    }
  });
}

// 微信登录
function wxLogin(openId) {
  wx.request({
    url: getApp().globalData.server + '/user/wxLogin',
    data: { open_id: openId },
    method: 'POST',
    header: { "content-type": "application/x-www-form-urlencoded" },
    success: function (res) {
      getApp().globalData.open_id = openId;
      getApp().globalData.isLoginCode = res.data.code;
      loginComplete()
    },
    fail: function (res) {
      loginErr();
    }
  })
}

// 登录完成
function loginComplete() {
  getApp().globalData.isWxLoginComplete = true;
  if (wx.hideLoading)
    wx.hideLoading()
  console.log("初始化openid完成")
}

// 登录失败
function loginErr() {
  console.log("获取openid登录失败")
  // 设置临时openid
  getApp().globalData.open_id = getApp().randomUUID(32);
  loginComplete();
}

module.exports = {
  getOpenId: getOpenId
}

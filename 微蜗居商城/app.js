//app.js
App({
  data: {
    info: [],
    kt_data: []
  },
  get_shop: function (appid) {
    var that = this;
    if (wx.getExtConfig) {
      var that = this;
      wx.getExtConfig({
        success: function (res) {
          var appid = res.extConfig.appid;
          // wx.setStorageSync('edition', res.extConfig.version);
          wx.login({
            success: function (res) {//登录成功
              if (res.code) {
                var code = res.code;
                wx.getUserInfo({//getUserInfo流程
                  success: function (res2) {//获取userinfo成功
                    var encryptedData = encodeURIComponent(res2.encryptedData);//加密串转成URI编码
                    var iv = res2.iv;
                    wx.request({
                      url: 'https://www.weiwoju.com/Wxa/ShoppingMallWxa/login',
                      data: {
                        code: code,
                        encryptedData: encryptedData,
                        iv: iv,
                        appid: appid
                      },
                      success: function (res) {
                        console.log(res);
                        if (res.data.errcode == 0) {
                          wx.setStorageSync('session_rd', res.data.session_rd);
                          wx.setStorageSync('shop_info', JSON.stringify(res.data.shop));
                        } else {
                          wx.showModal({
                            title: '提示',
                            content: res.data.errmsg,
                            success: function (res) {
                            }
                          });
                        }
                      }
                    })
                  },
                  fail: function (res) {
                    wx.request({
                      url: 'https://www.weiwoju.com/Wxa/ShoppingMallWxa/login',
                      data: {
                        code: code,
                        appid: appid
                      },
                      success: function (res) {
                        console.log(res);
                        if (res.data.errcode == 0) {
                          wx.setStorageSync('session_rd', res.data.session_rd);
                          wx.setStorageSync('shop_info', JSON.stringify(res.data.shop));
                        } else {
                          wx.showModal({
                            title: '提示',
                            content: res.data.errmsg,
                            success: function (res) {
                            }
                          });
                        }
                      }
                    })
                  },
                })
              }
            },
            fail: function (res) {
              console.log(res);

            }
          })
        }
      })
    }

  },
  onLoad: function () {
    console.log("屏幕高度" + res.windowHeight);

  },
  onLaunch: function () {
    var that = this;


    //调用API从本地缓存中获取数据
    wx.getSystemInfo({
      success: function (res) {

        wx.setStorageSync("windowHeight", res.windowHeight)
      }
    })
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function (res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  globalData: {
    userInfo: null
  }
})

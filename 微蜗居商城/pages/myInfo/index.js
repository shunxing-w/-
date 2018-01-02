//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  myorder:function(e){
   var state= e.currentTarget.dataset.state;
    wx.navigateTo({
      url: '../orderList/index?state='+state
    })
  },
  myaddress:function(){
    wx.chooseAddress({
      success: function (res) {}
    })
    // wx.navigateTo({
    //   url: '../addressList/index'
    // })
  },
  onShow(){
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              app.getUserInfo(function (userInfo) {
                //更新数据
                that.setData({
                  userInfo: userInfo
                })
              })
            },
            fail(res) {
              wx.openSetting({
                success: (res) => {

                }
              })
            }
          })
        }else{
          app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
              userInfo: userInfo
            })
          })
        }
      }
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据

    if (wx.getStorageSync('shop_info')) {
      this.setData({
        shop_info: JSON.parse(wx.getStorageSync('shop_info'))
      })
    }
    wx.setNavigationBarTitle({
      title: this.data.shop_info.company_name
    })
  }
})
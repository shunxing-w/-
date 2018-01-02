// pages/logistics/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:[],
    kt_data:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  return_order(){
    wx.navigateBack({
      delta: 1
    })
  },
  onLoad: function (options) {
    var that=this;
    wx.request({
      url: 'https://www.weiwoju.com/Wxa/ShoppingMallWxa/getExpress',
      data: {
        session_rd: wx.getStorageSync('session_rd'),
        no:options.id
      },
      success: function (res) {
        if (res.data.errcode==0){
          that.setData({
            info: res.data.info,
            kt_data: res.data.info.data
          })
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.errmsg,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }
        console.log(res);
     
       
      }
    })

    wx.setNavigationBarTitle({
      title:"物流信息"
    })
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
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
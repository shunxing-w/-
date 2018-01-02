Page({

  /**
   * 页面的初始数据
   */
  data: {
  queue_info:'',
  id:''
  },
  /**
   * 生命周期函数--监听页面加载
   */

  get_queueInfo:function(id){
    // console.log(123);
    var that=this;
    wx.request({
      url: 'https://www.weiwoju.com/Wxa/StoreWxa/queueInfo',
      data: {
        queue_id: id,
        session_rd: wx.getStorageSync('session_rd')
      },
      success: function (res) {
        // console.log(res);
        if (res.data.errcode == '0') {
            var queue_info = res.data.queue_info;
            that.setData({
              queue_info: queue_info
            })
          wx.setStorageSync('queue_info', JSON.stringify(queue_info));
       
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.errmsg,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    })
  },

  onLoad: function (options) {
   
    console.log(options.id);
    this.setData({
      id: options.id,
      shop: JSON.parse(wx.getStorageSync("shopinfo"))
    })
    this.get_queueInfo(options.id);
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
    var id = this.data.id;
    console.log(123)
    this.get_queueInfo(id);
    setTimeout(function () {
      wx.stopPullDownRefresh();
      
      wx.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 2000
      })      
    }, 2000);

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
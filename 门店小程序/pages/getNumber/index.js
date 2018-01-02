//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    table: [],
    queue_no:'',
    tablelist:[],
    sta:true,
    shop: [],
    array: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '更多']
  },
  //事件处理函数
  bindViewTap: function () {
    wx.redirectTo({
      url: '../logs/logs'
    })
  },
  colse:function(){
    this.setData({
      sta:true
    })
  },
  xz_table:function(event){
    var id = event.target.dataset.id
    console.log(id);
      this.setData({
        queue_no:id
      })
  },
  formSubmit:function(e){
    var fromId = e.detail.formId;
    var no = this.data.queue_no;
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://www.weiwoju.com/Wxa/StoreWxa/queueCall',
      data: {
        session_rd: wx.getStorageSync('session_rd'),
        queue_no: no,
        form_id: fromId
      },
      success: function (res) {
        console.log(res);
        wx.hideLoading();
        if (res.data.errcode == '0') {
          var queue_info = res.data.queue_info;
          wx.setStorageSync('queue_info', JSON.stringify(queue_info));
          that.setData({
            sta: true
          });
          wx.redirectTo({
            url: '../myNumber/index?id=' + queue_info.id,
          })
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: res.data.errmsg,
            success: function (res) {
              if (res.confirm) {
                that.setData({
                  sta: true
                })
                console.log('用户点击确定')
              }
            }
          })
        }
      }
    })
    
  },
  get_tabid(){
      this.setData({
        sta:false
      })
  },
  set_table(){
    var no = this.data.queue_no;
    var that=this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://www.weiwoju.com/Wxa/StoreWxa/queueCall',
      data: {
        session_rd: wx.getStorageSync('session_rd'),
        queue_no:no
      },
      success: function (res) {
        console.log(res);
        wx.hideLoading();
        if (res.data.errcode == '0') {
          var queue_info = res.data.queue_info;
          wx.setStorageSync('queue_info', JSON.stringify(queue_info));
          that.setData({
            sta: true
          });
          wx.redirectTo({
            url: '../myNumber/index?id=' + queue_info.id,
          })
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: res.data.errmsg,
            success: function (res) {
              if (res.confirm) {
                that.setData({
                  sta: true
                })
                console.log('用户点击确定')
              }
            }
          })
        }
      }
    })
  },
  onLoad: function () {
    this.setData({
      shop: JSON.parse(wx.getStorageSync("shopinfo"))
    })
     wx.request({
      url: 'https://www.weiwoju.com/Wxa/StoreWxa/queueList',
      data: {
        session_rd: wx.getStorageSync('session_rd')
      },
      success: function (res) {
        console.log(res);
        if (res.data.errcode == '0') {
          var article = res.data.queue_type;
          var tablelist = res.data.queue_list;
          that.setData({
            table: article,
            tablelist: tablelist,
            queue_no: article[0].queue_no
          })
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
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
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  }
})

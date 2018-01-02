var app = getApp()
Page({
  data: {
    state: 1,
    order_state: [
      {
        id: 1,
        "state": "全部订单"
      },
      {
        id: 2,
        "state": "待支付"
      },
      {
        id: 3,
        "state": "待发货"
      },
      {
        id: 4,
        "state": "待收货"
      },
      {
        id: 5,
        "state": "已完成"
      }
    ],
    order: [],
    index:0,
    hidden:true,
  },
  state_tab: function (event) {
    // wx.showLoading({ title: '加载中',});
    var state_name = event.currentTarget.dataset.state;
    switch (state_name) {
      case "全部订单": this.setData({ state: 1 }); break;
      case "待支付": this.setData({ state: 2 }); break;
      case "待发货": this.setData({ state: 3 }); break;
      case "待收货": this.setData({ state: 4 }); break;
      case "已完成": this.setData({ state: 5 }); break;
      default:
        return;
    }
    if (state_name == "全部订单") { state_name=''};
    var session_rd = wx.getStorageSync('session_rd');
    var orderlist = [];
    var that = this;
    wx.request({
      url: 'https://www.weiwoju.com/Wxa/ShoppingMallWxa/orderList',
      data: {
        session_rd: session_rd,
        status:state_name,
        page:1
      },
      success: function (res) {
        
        if(res.data.errcode==0){
          var orders = res.data.order;
          that.setData({
            hidden: true,
            order: orders,
            stae: true
          })
        }
        else if(res.data.errcode==12){
          app.Login();
        }
        else if (res.data.errcode == 1) {
          wx.showModal({
            title: '提示',
            content: res.data.errmsg,
            showCancel: false,
          })
          that.setData({
            order: ''
          })
        }
        
        
      },
    });

  },
  returned: function (e) {
    this.setData({
      option: false
    })
    var id = e.currentTarget.dataset.id;
    var url = '../orderDetails/index?no=' + id + '';
     wx.navigateTo({
      url: url
    })
  },
  order: function (i) {
    this.setData({
       hidden:false,
    })
        var session_rd = wx.getStorageSync('session_rd');
    var that = this;
       var orderlist = [];
    var state_name;
      switch (i) {
      case 1: state_name=''; break;
      case 2: state_name='待支付'; break;
      case 3: state_name='待发货'; break;
      case 4: state_name='待收货'; break;
      case 5: state_name='已完成'; break;
      default:
        return;
    }
    wx.request({
      url: 'https://www.weiwoju.com/Wxa/ShoppingMallWxa/orderList',
      data: {
        session_rd: session_rd,
        status: state_name,
        page: that.data.index + 1
      },
      success: function (res) {
        if (res.data.errcode == 12) {
					app.Login();
					that.order(i);
				} else if (res.data.errcode == 0){       
         if(res.data.order){
           setTimeout(function () {
             that.setData({
               stae: true
             })
           }, 1000)
           var orders = that.data.order.concat(res.data.order);
            that.setData({
             hidden: true,
             order:orders,
              index: that.data.index + 1
           })
         }else{
           return;
         }
        
      }else if (res.data.errcode == 1) {
          // wx.showModal({
          //   title: '提示',
          //   content: res.data.errmsg,
          //   showCancel: false,
          // })
        }
        that.setData({
          hidden:true,
          oss:res.data.oss
        })
      },
    });
  },
  onPullDownRefresh: function () {
   
    
    setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 2000);
  },
  // 加载 
  lower: function (e) {
    // console.log("加载更多了");
    if (this.data.stae == false) {
      return;
    } else {
      this.setData({
        stae: false
      })
      this.order(this.data.state);
    }
  },
  onLoad: function (options) {
    // this.order(1)
    this.setData({
      windowHeight: wx.getStorageSync('windowHeight'),
      shop_info: JSON.parse(wx.getStorageSync('shop_info')) 
    });
    console.log(options.state)
    if (options.state){
      this.setData({
        option:true
      })
      switch (options.state) {
        case "全部订单": this.setData({ state: 1 }); break;
        case "待支付": this.setData({ state: 2 }); break;
        case "待发货": this.setData({ state: 3 }); break;
        case "待收货": this.setData({ state: 4 }); break;
        case "已完成": this.setData({ state: 5 }); break;
        default:
          return;
      }
    }
    this.order(this.data.state);
  
    // 页面初始化 options为页面跳转所带来的参数
    // this.order(this.data.state);
  },
    onShow:function(){
      if (this.data.option==false){
        this.order(this.data.state);
      }
     
    // 页面显示
  },
})
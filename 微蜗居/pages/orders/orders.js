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
        "state": "进行中"
      },
      {
        id: 4,
        "state": "已完成"
      },
      {
        id: 5,
        "state": "已退款"
      },
    ],
    order: [],
    hidden:false,
  },
  state_tab: function (event) {
    // wx.showLoading({ title: '加载中',});
    var state_name = event.currentTarget.dataset.state;
    console.log(state_name);
    var session_rd = wx.getStorageSync('session_rd');
    var orderlist = [];
    var that = this;
    wx.request({
      url: 'https://www.weiwoju.com/WechatApplet/orderList',
      data: {
        session_rd: session_rd,
        ver_no: app.data.edition
      },
      success: function (res) {
        
        if(res.data.errcode==0){
          var orders = res.data.order;
          for (var i = 0; i < orders.length; i++) {
            if (orders[i].status == state_name) {
              orderlist.push(orders[i]);
            }
            if (state_name == '进行中') {
              if (orders[i].status == '待确认' || orders[i].status == '制作中' || orders[i].status == '配送中') {
                console.log(orders[i]);
                orderlist.push(orders[i]);
              }
            }
            if (state_name == "全部订单") {
              orderlist.push(orders[i]);
            }
          }
          that.setData({
            hidden: true,
            order: orderlist
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
        }
        
        
      },
    });
    switch (state_name) {
      case "全部订单": this.setData({ state: 1 }); break;
      case "待支付": this.setData({ state: 2 }); break;
      case "进行中": this.setData({ state: 3 }); break;
      case "已完成": this.setData({ state: 4 }); break;
      case "已退款": this.setData({ state: 5 }); break;
      default:
        return;
    }
  },
  returned: function (e) {
    var id = e.currentTarget.dataset.id
    var url = '../orderlist/orderlist?id=' + id + '';
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
      case 1: state_name='全部订单'; break;
      case 2: state_name='待支付'; break;
      case 3: state_name='进行中'; break;
      case 4: state_name='已完成'; break;
      case 5: state_name='已退款'; break;
      default:
        return;
    }
    // wx.showLoading({ title: '加载中',})
    wx.request({
      url: 'https://www.weiwoju.com/WechatApplet/orderList',
      data: {
        session_rd: session_rd,
        ver_no: app.data.edition
      },
      success: function (res) {
        console.log("dds");
        if (res.data.errcode == 12) {
					app.Login();
          console.log(1111);
					that.order(i);
				} 
        else if (res.data.errcode == 0){
        //  wx.hideLoading();        
         if(res.data.order){
           var orders = res.data.order;
           for (var i = 0; i < orders.length; i++) {
             if (orders[i].status == state_name) {
               console.log(111)
               orderlist.push(orders[i]);
             }
             if (state_name == '进行中') {
               if (orders[i].status == '待确认' || orders[i].status == '制作中' || orders[i].status == '配送中') {
                 console.log(orders[i]);
                 orderlist.push(orders[i]);
               }
             }
             if (state_name == "全部订单") {
               orderlist.push(orders[i]);
             }
           }
         }else{
           that.setData({
             hidden: true,
           })
         }
        
      }
       else if (res.data.errcode == 1) {
          wx.showModal({
            title: '提示',
            content: res.data.errmsg,
            showCancel: false,
          })
        }
        that.setData({
          hidden:true,
          order: orderlist
        })
      },
    });
  },
  onPullDownRefresh: function () {
    this.order(this.data.state);
    console.log(this.data.state);
    setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 2000);
  },
  onLoad: function (options) {
    console.log(this.data.state);
    // 页面初始化 options为页面跳转所带来的参数
    this.order(this.data.state);
  },
    onShow:function(){
    // 页面显示
  },
})
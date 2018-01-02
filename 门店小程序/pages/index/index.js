//index.js
//获取应用实例
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp()
Page({
  data: {
    shop:[],
    appid:[],
    appid2:'',
    coupon:'',
    queue:'',
    queue_id:'',
    queue_text:'去取号',
    receivetext:"点击\n领取"
  },
  //事件处理函数
  // bindViewTap: function() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  tell: function (event){
   var tel= event.currentTarget.dataset.tel
    // console.log(e)
    wx.makePhoneCall({
      phoneNumber: tel //仅为示例，并非真实的电话号码
    })
  },
  shop_info(id, session_rd){
    var that=this;
    var shopinfo='';
    wx.request({
        url: 'https://www.weiwoju.com/Wxa/StoreWxa/shop',
        data:{
          shop_id:id,
          session_rd: session_rd
        },
        success:function(res){
          if (res.data.errcode=='0'){
            var article = res.data.shop.description;
            shopinfo={
             address:res.data.shop.address,
             tel: res.data.shop.tel,
             shop_name: res.data.shop. shop_name,
             worktime: res.data.shop.worktime
            }
            console.log(res.data.queue_id);
            wx.setStorageSync('shopinfo', JSON.stringify(shopinfo));
            WxParse.wxParse('article', 'html', res.data.shop.description, that, 5);
            that.setData({
              shop: res.data.shop ,
              couponlist:res.data.couponlist,
              queue: res.data.queue
            })
            if (res.data.queue_id) {
              that.setData({
                queue_id: res.data.queue_id,
                queue_text:'我的排号'
              })
            }else{
              that.setData({
                queue_id:'',
                queue_text: '去取号'
              })
            }
            if (res.data.appid) {
              that.setData({
                appid2: res.data.appid
              })
            }
          }else{
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
  jump(event){
   
    var appid = event.currentTarget.dataset.id;
    console.log(appid);
    var id=this.data.shop.id;
    console.log(id);
    wx.navigateToMiniProgram({
      appId: appid,
      path: 'pages/index/index?'+id,
      extraData: {
        id: id
      },
      success(res) {
        console.log(res);
      }
    })
  },
  payment(){
    wx.navigateTo({
      url: '../payment/index',
    })
  },
  get_number:function(){
    var queue_id = this.data.queue_id; 
    if (queue_id){
      wx.navigateTo({
        url: '../myNumber/index?id=' + queue_id,
      })
    }else{
      wx.navigateTo({
        url: '../getNumber/index',
      })
    }
  },
  get_shop: function (appid) {
    var that = this;
    wx.login({
      success: function (res) {//登录成功
        if (res.code) {
          var code = res.code;
          wx.getUserInfo({//getUserInfo流程
            success: function (res2) {//获取userinfo成功
              var encryptedData = encodeURIComponent(res2.encryptedData);//加密串转成URI编码
              var iv = res2.iv;
              wx.request({
                url: 'https://www.weiwoju.com/Wxa/StoreWxa/login',
                data: {
                  code: code,
                  encryptedData: encryptedData,
                  iv: iv,
                  appid: appid,
                  ver_no: that.data.edition
                },
                success: function (res) {
                  console.log(res);
                  if (res.data.errcode == 0) {
                    that.shop_info(res.data.shop_id, res.data.session_rd);
                    wx.setStorageSync('session_rd', res.data.session_rd);
                    if (res.data.shop){
                      wx.setNavigationBarTitle({
                        title: res.data.shop.company_name
                      });
                    }
                    that.setData({
                      shop: res.data.shop
                    })
                    
                  }else{
                    wx.showModal({
                      title: '提示',
                      content: res.data.errmsg,
                      success: function (res) {
                      
                      }
                    });

                  }
                   
                }
              })
            }
          })
        }
      }
    })
    // wx.request({
    //   url: 'https://www.weiwoju.com/Wxa/StoreWxa/login',
    //   data:{
    //     shop_id:42
    //   },
    //   success:function(res){
    //     console.log(res);
    //     that.setData({
    //       shop:res.data.shop
    //     })
    //   }
    // })
  },


  receive: function (event) {
  
    var id = event.target.dataset.id;
    var shopid=this.data.shop.id;
    var wxcard_id = event.target.dataset.card_id;
    var session_rd = wx.getStorageSync('session_rd');
    console.log(id)
    var that = this;
    wx.request({
      url: "https://www.weiwoju.com/Wxa/StoreWxa/customerGetCoupon",
      data: {
        coupon_id: id,
        session_rd: session_rd
      },
      success: function (res) {
        if (wxcard_id!=''){
          wx.addCard({
            cardList: [
              {
                cardId: wxcard_id,
                cardExt: res.data.couponInfo.cardExt
              }
            ],
            success: function (res) {
              console.log(res.cardList) // 卡券添加结果
            },
            fail(detail) {
              wx.showModal({
                title: '提示',
                content: detail,
                showCancel: false,
           
              })

            }
          });
        }else{
          wx.showModal({
            title: '提示',
            content:"领取成功",
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                that.shop_info(shopid, session_rd);
              }
            }
          })
        }
       
        if (res.data.errcode == 1) {
          wx.showModal({
            title: '提示',
            content: res.data.errmsg,
            showCancel: false,
          })
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })

    this.setData({
      hid: true,
    })
  },
  onLoad: function () {
    var that = this;
    if (wx.getExtConfig) {
      wx.getExtConfig({
        success: function (res) {
          console.log(res.extConfig.appid);
          that.setData({
            appid: res.extConfig.appid,
            edition:'1.0.6'
          })
          that.get_shop(res.extConfig.appid);
          wx.setStorageSync('edition', res.extConfig.version);
        }
      })
    }
  },
  onShow: function (options) {
    var id = this.data.shop.id;
    console.log(id)
    if(id){
      console.log(6666666)
      this.shop_info(id, wx.getStorageSync("session_rd"));
    }
  },
  	onShareAppMessage: function (options) {
      console.log(options)
    // 用户点击右上角分享
    var that = this;
    return {
      title: that.data.shop.shop_name,
      desc: '',
      path: '/pages/index/index'
    }
  },
})

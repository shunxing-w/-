var WxParse = require('../../wxParse/wxParse.js');
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    shop:{},
    shop_info:'',
    indicatorDots00: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    animationData:{},
    shadow:true,
    prom:true,
    prom2: true,
    this_default_number:1,
    spec_id:'',
    style:'',
    state:true
  },
  buy: function (e) {
    
    this.setData({
      shadow: false,
      addShop:false
    });
    var animation = wx.createAnimation({
      duration:400,
      timingFunction: 'ease',
    })
    animation.height("70%").step()
    this.setData({
      animationData: animation.export()
    })
  },
  // 下一步订单界面
  confirm_order(){
    var that=this;
    if(that.data.shop.style.length>0 && that.data.style==''){
      that.setData({
        prom: false
      })
      setTimeout(function () { that.setData({ prom: true }) }, 1000)
    }else{
    var ShopCart=[];
      ShopCart.push({
        id: that.data.shop.id,
        name: that.data.shop.name,
        img: that.data.oss + that.data.shop.major_pic_url,
        num: that.data.this_default_number,
        price: that.data.price,
        style: that.data.style
      }) 
      that.setData({
        shadow: true
      })
      wx.setStorageSync('ShopCart', JSON.stringify(ShopCart));
      wx.navigateTo({
        url: '../Order/order',
      })
    }
    
      
  },

  set_spec(event){
    var id = event.currentTarget.dataset.id;
    var style = event.currentTarget.dataset.style;
    console.log(style);
    this.setData({
      spec_id:id,
      style: style,
      price:style.price
    })
    console.log(id)
    
  },
  add_shopcar(){
    this.setData({
      shadow: false,
      addShop:true
    });
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
    })
    animation.height("70%").step()
    this.setData({
      animationData: animation.export()
    })

  },
  shopCar(){
    wx.switchTab({
      url: '../shopCar/index'
    })
  },
  // 首页
  home() {
    wx.switchTab({
      url: '../index/index'
    })
  },
  // 商品数量加
  commodity_plus() {
    var that = this
    var this_default_number = parseInt(that.data.this_default_number)
    that.setData({
      this_default_number: this_default_number + 1
    })
  },
  // 商品数量减
  commodity_reduce(){
    var that = this
    var this_default_number = parseInt(that.data.this_default_number)
    if (this_default_number > 1) {
      that.setData({
        this_default_number: this_default_number - 1
      })
    } else {
      that.setData({
        this_default_number: 1
      })
    }
  },

// 加入购物车
  addShopcar(){
    var that=this;
    var shop = this.data.shop;
    var style_id = this.data.spec_id;
    var style = this.data.style;
    var num = this.data.this_default_number;
    var img = this.data.oss + shop.major_pic_url;
    var exist = null;
    var exist_key = '';
    if (wx.getStorageSync('shopCar') && wx.getStorageSync('shopCar')!='[]'){
      var shopCar = JSON.parse(wx.getStorageSync('shopCar'));
      if (style_id) {
        shopCar.forEach(function (item, index) {
          if (item.id == shop.id && item.style.style_id == style_id) {
            exist = item;
            exist_key = index;
          }
        });
        if (exist != null) {
          exist.num += num;
          shopCar[exist_key] = exist;
        } else {
          shopCar.push({
            id: shop.id,
            name: shop.name,
            img: img,
            num: num,
            price: that.data.price,
            style: style
          });
        }
      } else {
        shopCar.forEach(function (item, index) {
          if (item.id == shop.id) {
            exist = item;
            exist_key = index;
          }
        });
        if (exist != null) {
          exist.num += num;
          shopCar[exist_key] = exist;
        } else {
          shopCar.push({
            id: shop.id,
            name: shop.name,
            img: img,
            num: num,
            price: that.data.price,
            style: style
          });
        }
      }
    }else{
      var shopCar =[];
      console.log(121)
      shopCar.push({
        id: shop.id,
        name: shop.name,
        img: img,
        num: num,
        price: that.data.price,
        style: style
      });
    }
      wx.setStorageSync('shopCar', JSON.stringify(shopCar));
      that.setData({
        prom2: false
      })
      setTimeout(function () { that.setData({ prom2: true }) }, 1500);
      this.setData({
        shadow:true,
        this_default_number: 1,
        spec_id: '',
        style: ''
      })
      this.shopcar_stae();
  },
  shopcar_stae(){
    if (wx.getStorageSync('shopCar') && wx.getStorageSync('shopCar') != '[]') {
      this.setData({
        state: false
      })
    }
  },
  close:function(){
    this.setData({
      shadow: true
    });
    var animation = wx.createAnimation({
      duration: 100,
      timingFunction: 'ease',
    })
    animation.height("0%").step()
    this.setData({
      animationData: animation.export()
    })
  },
  //客服消息
  weapp:function(e){
    console.log(e)
  },
 getproductdeta(id){
   var that=this;
   wx.request({
     url: 'https://www.weiwoju.com/Wxa/ShoppingMallWxa/productDetail',
     data: {
       session_rd: wx.getStorageSync('session_rd'),
       pro_id: id
     },
     success: function (res) {
       if (res.data.errcode == 12) {
         app.get_shop();
         that.getproductdeta(id)
       }
       if (res.data.product.description) {
         WxParse.wxParse('article', 'html', res.data.product.description, that, 5)
       }
       that.setData({
         imgUrls: res.data.product.multi_pic_url.split(';'),
         oss: res.data.oss,
         shop: res.data.product,
         price: res.data.product.price
       })
       if (res.data.product.style.length > 0) {
         that.setData({
           style: res.data.product.style[0],
           spec_id: res.data.product.style[0].style_id,
           price: res.data.product.style[0].price
         })
       }
     }
   })
 },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (wx.getStorageSync('shop_info')) {
      this.setData({
        shop_info: JSON.parse(wx.getStorageSync('shop_info'))
      })
      wx.setNavigationBarTitle({
        title: this.data.shop_info.company_name
      })
    }
    var that=this;
    if (wx.getStorageSync('session_rd') == false || wx.getStorageSync('session_rd') == '') {
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
                            that.getproductdeta(options.id)
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
                            that.getproductdeta(options.id)
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
        })}
    }else{
      this.getproductdeta(options.id)
    }
  
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
    this.shopcar_stae()
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
  onShareAppMessage: function (options) {
    var that = this;
    return {
      title: that.data.shop.name,
      desc: '',
      path: '/pages/Comdetails/index?id='+that.data.shop.id
    }
  }
})
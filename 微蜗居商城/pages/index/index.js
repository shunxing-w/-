//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    windowHeight: 654,
    motto: 'Hello World',
    userInfo: {},
    index: 1 ,
    oss:'',
    shop_info:'',
    shop:[],
    goodsDetail:[],
    animationData: {},
    stae:true,
    hasMore:true,
    shadow:true,
    this_default_number: 1,
    spec_id: '',
    style: '',
    prom: true,
    prom2:true
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../Comdetails/logs'
    })
  },
  shopDeta(e){
    var shop = e.currentTarget.dataset.shop;
    var id = e.currentTarget.dataset.id;
    wx.setStorageSync('shop', JSON.stringify(shop));
    console.log(shop);

    wx.navigateTo({
      url: '../Comdetails/index?id='+id
    })
  },
  purchase(e){
    var id = e.currentTarget.dataset.id;
    var that=this;
 
    wx.request({
      url: 'https://www.weiwoju.com/Wxa/ShoppingMallWxa/productDetail',
      data: {
        session_rd: wx.getStorageSync('session_rd'),
        pro_id: id
      },
      success: function (res) {
        console.log(res.data.product.style == true);
        that.setData({
          oss: res.data.oss,
          goodsDetail: res.data.product,
          price: res.data.product.price
        })
        if (res.data.product.style.length > 0) {
          that.setData({
            style: res.data.product.style[0],
            spec_id: res.data.product.style[0].style_id,
            price: res.data.product.style[0].price
          })
        }
        that.setData({
          shadow: false,
          addShop: false
        })
      }
    })
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
    })
    animation.height("70%").step()
    this.setData({
      animationData: animation.export()
    })
  },
  commodity_plus() {
    var that = this
    var this_default_number = parseInt(that.data.this_default_number)
    that.setData({
      this_default_number: this_default_number + 1
    })
  },
  // 商品数量减
  commodity_reduce() {
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
  set_spec(event) {
    var id = event.currentTarget.dataset.id;
    var style = event.currentTarget.dataset.style;
    console.log(style);
    this.setData({
      spec_id: id,
      style: style,
      price: style.price
    })
    console.log(id)

  },
  close: function () {
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
  // 下一步订单界面
  confirm_order() {
    var that = this;
    if (that.data.goodsDetail.style.length > 0 && that.data.style == '') {
      that.setData({
        prom: false
      })
      setTimeout(function () { that.setData({ prom: true }) }, 1000)
    } else {
      var ShopCart = [];
      ShopCart.push({
        id: that.data.goodsDetail.id,
        name: that.data.goodsDetail.name,
        img: that.data.oss + that.data.goodsDetail.major_pic_url,
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
  // 加入购物车
  addShopcar() {
    var that = this;
    var shop = this.data.goodsDetail;
    var style_id = this.data.spec_id;
    var style = this.data.style;
    var num = this.data.this_default_number;
    var img = this.data.oss + this.data.goodsDetail.major_pic_url;
    var exist=null;
    var exist_key='';
   
  
    if (wx.getStorageSync('shopCar') && wx.getStorageSync('shopCar') != '[]') {
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
    } else {
      var shopCar = [];
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
      shadow: true,
      this_default_number: 1,
      spec_id: '',
      style: ''
    })
  },
  conter: function (id, session_rd){
    var that = this;
    wx.request({
    url: 'https://www.weiwoju.com/Wxa/ShoppingMallWxa/prolist',
    data: {
      shop_id: id,
      session_rd: session_rd,
      page: that.data.index+1
    },
    success: function (res) {
      if(res.data.prolist.length>0){
       
        var shop = that.data.shop.concat(res.data.prolist);
        setTimeout(function(){
          that.setData({
            stae: true
          })
        },1000)
        that.setData({
          shop: shop,
          index: that.data.index + 1
        })
      }else{
        that.setData({
          hasMore: false,
        })
        return;
      }
     
    }
  })
},

  get_goods: function (id, session_rd){
    var that=this;
    wx.request({
      url: 'https://www.weiwoju.com/Wxa/ShoppingMallWxa/prolist',
      data: {
        shop_id: id,
        session_rd: session_rd,
        page: that.data.index
      },
      success:function(res){
        that.setData({
          shop: res.data.prolist,
          oss:res.data.oss
        })
      }
    })
},

  // 下拉刷新
  upper: function (e) {
    // console.log("下拉刷新了");
    this.get_goods(this.data.shop_info.id,this.data.session_rd);
  },
  // 加载 
  lower: function (e) {
    // console.log("加载更多了");
    if(this.data.stae==false){
      return;
    }else{
      this.setData({
        hasMore:true,
        stae:false
      })
      
      this.conter(this.data.shopId, this.data.session_rd);
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
                url: 'https://www.weiwoju.com/Wxa/ShoppingMallWxa/login',
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
                    that.get_goods(res.data.shop_id, res.data.session_rd);
                    wx.setStorageSync('session_rd', res.data.session_rd);
                    if (res.data.shop) {
                      wx.setNavigationBarTitle({
                        title: res.data.shop.company_name
                      });
                    }
                    wx.setStorageSync('shop_info', JSON.stringify(res.data.shop))
                    that.setData({
                      shop_info: res.data.shop,
                      shopId: res.data.shop_id,
                      session_rd: res.data.session_rd
                    })

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
                    that.get_goods(res.data.shop_id, res.data.session_rd);
                    wx.setStorageSync('session_rd', res.data.session_rd);
                    if (res.data.shop) {
                      wx.setNavigationBarTitle({
                        title: res.data.shop.company_name
                      });
                    }
                    wx.setStorageSync('shop_info', JSON.stringify(res.data.shop))
                    that.setData({
                      shop_info: res.data.shop,
                      shopId: res.data.shop_id,
                      session_rd: res.data.session_rd
                    })

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
      
      complete:function(res){
        console.log(res)
      }
    })
  },
  
  onLoad: function () {
    console.log('onLoad')
    var that = this;
    this.setData({
      windowHeight: wx.getStorageSync('windowHeight')
    });
    if (wx.getExtConfig) {
      wx.getExtConfig({
        success: function (res) {
          console.log(res.extConfig.appid);
          that.setData({
            appid: res.extConfig.appid,
            edition: '1.0.6'
          })
          that.get_shop(res.extConfig.appid);
          wx.setStorageSync('edition', res.extConfig.version);
        }
      })
    }
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  },
  onShow:function(){
  
  },
  onPullDownRefresh: function () {
    this.get_goods(this.data.shop_info.id, this.data.session_rd);
    setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 1000);
  },
  onShareAppMessage: function (options) {
    console.log(options)
    // 用户点击右上角分享
    var that = this;
    return {
      title: that.data.shop_info.company_name,
      desc: '',
      path: '/pages/index/index'
    }
  }

})

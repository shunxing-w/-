var app = getApp()
Page({
  data: {
    state: 1,
    order: [],
    shop:[],
    shop_info: [],
    cart:[],
    hidden: true,
    edit:false,
    total:0
  },
  edit:function(){
    if(this.data.edit==false){
      this.setData({
        edit: true
      })
    }else{
      this.setData({
        edit: false
      })
    }
  },
  Settlement(){
    if(this.data.total==0){
        return;
    }else{
      var shop = this.data.shop;
      var shopcar = [];
      shop.forEach(function (item, index) {
        if (item.status == true) {
          shopcar.push(item)
        }
      });
      wx.setStorageSync('ShopCart', JSON.stringify(shopcar));
      wx.navigateTo({
        url: '../Order/order',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  
  },
  add_goods(event){
    let id = event.currentTarget.dataset.id;
    let style = event.currentTarget.dataset.style;
    var shop = this.data.shop;
    var total = 0;
    if(style){
      shop.forEach(function (item, index) {
        if (item.id == id && item.style.style_id == style) {
          item.num++;
        }
      });
    }else{
      shop.forEach(function (item, index) {
        if (item.id == id) {
          item.num++;
        }
      });
    }
  
 
    this.setData({
      shop: shop
    })
  },
  reduce_goods(event){
    let id = event.currentTarget.dataset.id;
    let style = event.currentTarget.dataset.style;
    var shop = this.data.shop;
    var total = 0;
    if(style){
      shop.forEach(function (item, index) {
        if (item.id == id) {
          if (item.num > 1) {
            item.num--;
          }
        }
      });
    }else{
      shop.forEach(function (item, index) {
        if (item.id == id && item.style.style_id == style) {
          item.num--;
        }
      });
    }
   
    this.setData({
      shop: shop
    })
  },
  selectDish(event) {
    // 选择商品
    let dish = event.currentTarget.dataset.id;
    let style = event.currentTarget.dataset.styleid;
    var wsx = dish+'|'+style;
    console.log(style);
    let flag = true;
    let cart = this.data.cart;
    if (cart.length > 0) {
      cart.forEach(function (item, index) {

        if (item == wsx) {
          cart.splice(index, 1);
          flag = false;
        }
      })
    }
    if (flag) cart.push(wsx);
    this.setData({
      cartTotal: cart.length
    })
    this.setStatus(wsx)
  },
  setStatus(dishId) {
    // 添加选中效果
    let dishes = this.data.shop;

    for (let dish of dishes) {
      console.log(dish.style.style_id);
      console.log(dishId)
      var car = dish.id + '|' + dish.style.style_id;
      if (car == dishId) {
          dish.status = !dish.status || false
        }
    }
    this.setData({
      shop: dishes
    })
    this.total()
  },
  // 
  select(){
    let dishes = this.data.shop;
    var select = !this.data.select || false;
    console.log(select);
    for (let dish of dishes) {
      if (select==true){
        dish.status = true
      }else{
        dish.status = false
      }  
    }
    this.setData({
      shop: dishes,
      select:select
    })
    this.total()
  },
  total: function (coupon) {
    var shop=this.data.shop;
    var total=0;
    shop.forEach(function (item, index) {
      if (item.status== true) {
        total += parseFloat(item.price * item.num);
      }
    });
    // var total = 0;
    // var totals = 0;
    // total = this.data.shopcar.price * this.data.shopcar.num;
    // if (coupon) {
    //   total = total - coupon;
    // }
    this.setData({
      total: parseFloat(total.toFixed(2))
    })
  },
  goods_del: function (event){
    let id = event.currentTarget.dataset.id;
    let styleid = event.currentTarget.dataset.styleid;
    var shop = this.data.shop;
    var total = 0;
    shop.forEach(function (item, index) {
      if(item.style){
        if (item.id == id && item.style.style_id == styleid) {
          shop.splice(index, 1);
        }
      }else{
        if (item.id == id) {
          shop.splice(index, 1);
        }
      }
      
    });
    wx.setStorageSync("shopCar", JSON.stringify(shop));
    this.setData({
      shop:shop
    })
  },
  Shopping(){
    wx.switchTab({
      url: '../index/index'
    })
  },

  onLoad: function (options) {
    console.log(this.data.state);
    if (wx.getStorageSync('shopCar')){
      this.setData({
        shop: JSON.parse(wx.getStorageSync('shopCar')),
        order: JSON.parse(wx.getStorageSync('shopCar'))
      })
    }
    if (wx.getStorageSync('shop_info')) {
      this.setData({
        shop_info: JSON.parse(wx.getStorageSync('shop_info'))
      })
    }
    wx.setNavigationBarTitle({
      title: this.data.shop_info.company_name
    })
  },
  onShow: function () {
    // 页面显示
    if (wx.getStorageSync('shopCar')) {
      this.setData({
        shop: JSON.parse(wx.getStorageSync('shopCar')),
        order: JSON.parse(wx.getStorageSync('shopCar'))
      })
    }
  },
})
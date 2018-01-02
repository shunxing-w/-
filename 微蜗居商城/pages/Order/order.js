var app = getApp();
Page({
    data: {
        total: 0,
        shopcar: [],
        add: "none",
        address: [],
        address_list: [],
        shop: [],
        i: 0,
        shop_url:'',
        hidden:true,
        delivery_pre_time: 0,
        customer_coupon:'',
        coupon:[],
        coupon_text:'暂无优惠券',
        cou_hid: true,
        inp_n:true,
        animation:'',
        totals:0,
        wsx:false,
        remarks:'留言'
    },
    bindPickerChange: function (e) {
      this.setData({
        index: e.detail.value,
        eat_num: this.data.array[e.detail.value],
      })
    },   
    eat_hild(){
      this.setData({
        cou_hid:true
      })
    },
    total: function (coupon) {
        var coupon = coupon||0;
        var total = 0;
        var totals =0;  
        var shop = this.data.shopcar;
        shop.forEach(function (item, index) {
            total += parseFloat(item.price * item.num);
        }); 
        if (coupon){
          total = total - coupon;
        }
        
        if (total==0){
          total=0.1
        }
        total = total + parseFloat( this.data.shop_info.express_price);
        this.setData({
          total: parseFloat(total.toFixed(2)),
          totals:parseFloat(totals.toFixed(2))
        })
    },
    // 选择地址
    add_address: function (id) {
        var add_id = id;
        var session_rd = wx.getStorageSync('session_rd');
        var that = this;
        wx.request({
          url: 'https://www.weiwoju.com/Wxa/ShoppingMallWxa/addressUse',
          data: {
            session_rd: session_rd,
            id: add_id,
            ver_no: wx.getStorageSync("edition")
          },
          success: function (res) {         
            if (res.data.errcode == 1) {
              wx.showModal({
                title: '提示',
                content: res.data.errmsg,
                showCancel: false,
              })
            }
            that.get_address(that.data.shop_info.id);
          },
          fail: function (res) { console.log(res) }
        })
          this.setData({
            // address:address,
            add: "none"
        })
    },
    set_address: function (e) {
      var add_id = e.currentTarget.dataset.add_id;
      var session_rd = wx.getStorageSync('session_rd');
      var that = this;
      wx.request({
        url: 'https://www.weiwoju.com/Wxa/ShoppingMallWxa/addressUse',
        data: {
          session_rd: session_rd,
          id: add_id,
          ver_no: wx.getStorageSync("edition")
        },
        success: function (res) {
          if (res.data.errcode == 1) {
            wx.showModal({
              title: '提示',
              content: res.data.errmsg,
              showCancel: false,
            })
          }
          that.get_address(that.data.shop_info.id);
        },
        fail: function (res) { console.log(res) }
      })
      this.setData({
        // address:address,
        add: "none"
      })
    },
    show_add: function (e) {
        var that=this;
        var address_list= this.data.address_list;
        var adres=null;
      wx.chooseAddress({
        success: function (res) {
          address_list.forEach(function (item, index) {
            // console.log(item)
            if (item.name == res.userName && item.tel == res.telNumber && item.city == res.cityName && item.prov == res.provinceName && item.country == res.countyName && item.address == res.detailInfo){
              adres=item.id;
            }
          })
          if(adres!=null){
            that.add_address(adres);
          }else{
            wx.request({
              url: 'https://www.weiwoju.com/Wxa/ShoppingMallWxa/addressAdd',
              data: {
                session_rd: wx.getStorageSync('session_rd'),
                name: res.userName,
                tel: res.telNumber,
                prov: res.provinceName,
                city: res.cityName,
                country: res.countyName,
                address: res.detailInfo
              },
              success: function (res) {
                if (res.data.errcode==0){
                 that.get_address(that.data.shop_info.id);
               }
                if (res.data.errcode == 1) {
                  wx.showModal({
                    title: '提示',
                    content: res.data.errmsg,
                    showCancel: false,
                  })
                }
              }
            })
          }
          // that.setData({
          //   address: addres
          // })
        }
        ,
        fail: function (res) { 
          that.setData({
            add: "block"
          })
        }
      })
    },
    bj_address: function (e) {
        var data = e.currentTarget.dataset.address;
        var address = JSON.stringify(data);
        var url = '../addressEdit/addressEdit?address=' + address + '';
        wx.navigateTo({
            url: url
        })
    },
    clear_address:function(e){
      var that = this;
      var add_id = e.currentTarget.dataset.id;
      var session_rd = wx.getStorageSync('session_rd');
      wx.request({
        url: 'https://www.weiwoju.com/Wxa/ShoppingMallWxa/addressDel',
        data: {
          session_rd: session_rd,
          id: add_id
        },
        success: function (res) {
          if (add_id == that.data.address.id) {

            for (let i = 0; i < that.data.address_list.length; i++) {
              if (that.data.address_list[i].id == add_id) {
                if (i == 0) {
                  i = 1;
                }
                console.log(that.data.address_list[i - 1]);
                // that.add_address(that.data.address_list[i - 1].id)
                wx.request({
                  url: 'https://www.weiwoju.com/Wxa/ShoppingMallWxa/addressUse',
                  data: {
                    id: that.data.address_list[i - 1].id,
                    session_rd: session_rd
                  },
                  success: function (res) {

                    console.log("删除更新成功")
                    if (res.data.errcode == 1) {
                      wx.showModal({
                        title: '提示',
                        content: res.data.errmsg,
                        showCancel: false,
                      })
                    }
                  }
                });
              }
            }
          }
          if (res.data.errcode == 1) {
            wx.showModal({
              title: '提示',
              content: res.data.errmsg,
              showCancel: false,
            })
          }
          that.get_address(that.data.shop_info.id);
        },
        fail: function (res) { console.log(res) }
    
      })
    },
    show_add2: function (e) {
        this.setData({
            add: "block"
        })
    },
    hidde: function () {
        this.setData({
            add: "none"
        })
    },
    // 添加地址跳转
    returned: function () {
      if (this.data.i == 1) {
        return;
      }
      this.setData({
        i: 1
      })
      var that=this;
      wx.chooseAddress({
        success: function (res) {
          var addres = {
            name: res.userName,
            tel: res.telNumber,
            prov: res.provinceName,
            city: res.cityName,
            country: res.countyName,
            address: res.detailInfo
          }
          that.setData({
            address: addres
          })
          wx.request({
            url: 'https://www.weiwoju.com/Wxa/ShoppingMallWxa/addressAdd',
            data: {
              session_rd: wx.getStorageSync('session_rd'),
              name: res.userName,
              tel: res.telNumber,
              prov: res.provinceName,
              city: res.cityName,
              country: res.countyName,
              address: res.detailInfo
            },
            success: function (res) {
              if (res.data.errcode==0){
                that.setData({
                  address: res.data.data,
                  i:0
                })
              }
            }
          })
          
        },
        fail:function(res){
         wx.navigateTo({
           url: '../address/address',
         })
        }
      })
    },
    remarks:function(e){
      if (e.detail.value!=""){
        this.setData({
          remarks: e.detail.value,
          inp_n: true,
          rema_n: false
        })
      }
    },
    input_text:function(e){
      this.setData({
        inp_n: false,
        rema_n: true,
        inp_fo:true
      })
    },
    coupon_tap:function(){
      this.setData({
        cou_hid: false
      });
      var animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease',
        delay: 0
      })
      this.animation = animation
      this.animation.height(0).height('60%').step();
      this.setData({
        //输出动画
        animation: this.animation.export()
      })

    },
    use_coupons: function (e) {
      var coupon = e.currentTarget.dataset.coupon;
      var limit = this.data.totals;
      var delivery_prices = this.data.delivery_price;
      console.log(delivery_prices);
      if (limit >= coupon.coupon_use_limit){
        var cpupon_prc =coupon.coupon_value
        this.total(delivery_prices, parseFloat(cpupon_prc));
        this.setData({
          coupon: coupon,
          coupon_text: '-￥' + parseFloat(coupon.coupon_value),
          cou_hid:true    
        });
      }
    },
    //   下单支付
    place_order: function () {
        this.setData({
            hidden:false
        });
        var shop = this.data.shopcar;
        var prolist = [], i;
        shop.forEach(function (item, index) {
            prolist.push({
              proid: item.id,
              num: item.num,
              style_id: item.style.style_id || 0
            })
          })
        if (this.data.i == 1) {
            return;
        }
        this.setData({
            i: 1
        })
        console.log(this.data.address)
        var address_id = this.data.address.id;
        console.log(address_id);
        if (address_id == undefined) {
            wx.showModal({
                title: '提示',
                content: '请添加收货地址',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                    return;
                }
            });
            this.setData({
              hidden: true,
              i: 0
            })
        }else{

        
        var that = this;
        var coupon_id = this.data.coupon.id;
        var session_rd = wx.getStorageSync('session_rd');
        wx.request({
          url: "https://www.weiwoju.com/Wxa/ShoppingMallWxa/placeOrder",
            header: {
              'Accept': 'application/json'
            },
            data: {
                address_id: address_id,
                remark: that.data.remarks||'',
                session_rd: session_rd,
                prolist:prolist
            },
            success: function (res) {
              if (res.data.errcode==12){
                app.Login();
                that.place_order();
              }
              that.setData({
                  hidden:true,
                  i: 0
              })
                if (res.data.errcode == 1) {
                  wx.showModal({
                    title: '提示',
                    content: res.data.errmsg,
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                      return;
                    }
                });
                return;
              }
                // wx.hideLoading();
                var pay_info = res.data.pay_info;
                var order_id = res.data.order_no;
                var appId = pay_info.appId;
                var timeStamp = pay_info.timeStamp;
                var nonceStr = pay_info.nonceStr;
                var packages = pay_info.package;
                var paySign = pay_info.paySign;
                wx.requestPayment({
                    appId: appId,
                    timeStamp: timeStamp,
                    signType: 'MD5',
                    package: packages,
                    nonceStr: nonceStr,
                    paySign: paySign,
                    success: function (res) {
                      var url = '../orderDetails/index?no=' + order_id + '&state=1';
                        wx.redirectTo({
                            url: url
                        })
                        console.log('支付成功');
                    },
                    fail: function (res) {
                      var url = '../orderDetails/index?no=' + order_id + '&state=1';
                        wx.redirectTo({
                          url: url
                        })
                        console.log(res)
                    },
                    complete: function () {
                        // that.setData({
                        //     i: 0
                        // })
                    }
                });
            }
        })
        }
    },
    get_address(id) {
        var session_rd = wx.getStorageSync('session_rd');
        var  that = this;
        var shop_id=id;
        wx.request({
          url: 'https://www.weiwoju.com/Wxa/ShoppingMallWxa/myAddress?t='+Math.random(),
            data: {
                session_rd: session_rd,
                shop_id: shop_id,
                ver_no: wx.getStorageSync("edition")
            },
            success: function (res) {
              if (res.data.errcode==12){
                app.Login();
                that.get_address(id);
              }
              if (res.data.errcode == 0){
                console.log(res.data.addresses)
                for (let i=0;i<res.data.addresses.length;i++){
                  if (res.data.addresses[i].default==1){
                    that.setData({
                      address: res.data.addresses[i]
                    })
                  }
                }
                that.setData({
                  address_list: res.data.addresses
                })              
              }
            },
            fail: function (res) {
                console.log(res)
            },
        })
    },

    onLoad: function (option) {
      this.get_address(this.data.shop_id);
          this.setData({
            shopcar: JSON.parse(wx.getStorageSync('ShopCart')),
            shop_info: JSON.parse(wx.getStorageSync('shop_info'))
        }) 
         this.total();
          console.log(this.data.address);
    },
    onReady: function () {
    },
    onShow: function () {
      if (wx.getStorageSync('addres')){
        console.log(wx.getStorageSync('addres'));
      var addres = JSON.parse(wx.getStorageSync('addres'));
     
      var that=this;  
      this.get_address(that.data.shop_info.id)  
    //   if(addres&&this.data.wsx!=true){
    //     var address_list = this.data.address_list||[];
    //     console.log(address_list);
    //     address_list.push({
    //       id: 0,
    //       name: addres[0].name,
    //       sex: addres[0].sex,
    //       tel: addres[0].call,
    //       address: addres[0].address
    //     })
        
    //     this.setData({
    //       address_list: address_list,
    //       address: addres[0]
    //     })
        
      
    // }
      // this.setData({
      //   address_list: addres,
      //   address: addres[0]
      // })

      // 
  }    
      // 页面显示
    },

})
var app = getApp();
Page({
    data: {
        menu: [],
        package_total: 0,
        total: 0,
        shopcar: [],
        add: "none",
        address: [],
        eat_num: 1,
        address_all: [],
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
        animation:'',
        totals:0,
        inp_n:false,
        rema_n:true,
        inp_fo:false,
        array: ['1人','2人','3人','4人','5人','6人','7人','8人','9人','10人','大于10人'],
        wsx:false,
        full_subtract:'',
        Discount:'',
        free_price:0,
        Member:true,
        second:60,
        number:60,
        tel:'',
        code:'',
        sign_info:"点击登录",
        wallet:"",
        paymethod:"余额支付",
        payhid:true,
    },
    bindPickerChange: function (e) {
      this.setData({
        index: e.detail.value,
        eat_num: this.data.array[e.detail.value],
      })
    },
    shopcar: function (id) {
        if (wx.getStorageSync('shopcar' + id) != '') {
            var shopcar = JSON.parse(wx.getStorageSync('shopcar' + id)) || [];
        } else {
            var shopcar = wx.getStorageSync('shopcar' + id) || [];
        }
        this.setData({
            menu: shopcar,
        });
    },
   
    eat_hild(){
      this.setData({
        cou_hid:true,
        Member: true
      })
    },

    // eat_num: function (event) {
    //     var id = event.currentTarget.dataset.id;
    //     console.log(id)
    //     this.setData({
    //         eat: "none",
    //         eat_num: id
    //     })

    // },
    package_total: function () {
        var all = this.data.menu;
        var total = 0;
        if (all.length) {
            for (let i = 0; i < all.length; i++) {
                total += all[i].num * all[i].package_price;
            };
        }
        this.setData({
            package_total: total
        })
    },
    total: function (delivery_price,coupon) {
        var all = this.data.menu;
        var package_total = parseFloat(this.data.package_total)||0;
        var delivery_prices = parseFloat(delivery_price)||0;
        var coupon = coupon||0;
        var total = 0;
        var totals =0;
        var full_subtract = this.data.full_subtract;        
        if (all.length) {
          for (let i = 0; i < all.length; i++) {
             total += all[i].num * all[i].price;
          };
      
            total = parseFloat(total.toFixed(2)) + package_total + delivery_prices;
            totals = total - delivery_prices;
          
        }       
        
        
        if (full_subtract) {
          var arr = [];
          for (var i in full_subtract) {
            var str = {
              condit: i,
              price: full_subtract[i]
            }
            arr.push(str);
          }
          // console.log(arr[0])
          for (let i = 0; i < arr.length; i++) {
          
            if (totals>= arr[i].condit) {
             if(i==0){
               this.setData({
                 Discount: arr[0].price
               }) 
             }else{
                if (parseInt(arr[0].condit) > parseInt(arr[1].condit)) {
                  this.setData({
                    Discount: arr[0].price
                  })           
                }else{
                  this.setData({
                    Discount: arr[1].price
                  })
                }
              }
               total = totals + delivery_prices - parseFloat(this.data.Discount);            
            }
          }
        }
       
        if (coupon){
          total = total - coupon;
        }
        
        if (total==0){
          total=0.1
        }
        this.setData({
          total: parseFloat(total.toFixed(2)),
          totals:parseFloat(totals.toFixed(2))
        })
    },
    // 选择地址
    add_address: function (e) {
        var add_id = e.currentTarget.dataset.add_id;
        var status = e.currentTarget.dataset.status;
        var session_rd = wx.getStorageSync('session_rd');
        var that = this;
        if (status =="abled"){
        wx.request({
            url: 'https://www.weiwoju.com/Wxa/DeliveryWxa/addressUse',
            data: {
                id: add_id,
                session_rd: session_rd,
                ver_no: wx.getStorageSync("edition")
            },
            success: function (res) {
              if (res.data.errcode==0){
                console.log('设置成功');
                that.get_address(that.data.shop_id);
              }
              if(res.data.errcode==1){
                wx.showModal({
                  title: '提示',
                  content: res.data.errmsg,
                  showCancel: false,
                })
              }
                
            },
            fail: function (res) {
            },
        });
        this.setData({
            // address:address,
            add: "none"
        })
      }else{
          wx.showModal({
            title: '提示',
            content: '该地址超出配送范围',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
              return;
            }
          })
      }
    },
    clear_address(e) {
        var id = e.currentTarget.dataset.id
        var session_rd = wx.getStorageSync('session_rd');
        var that = this;       
        wx.showModal({
          title: '提示',
          content: '确认删除此收货地址？',
          success: function (res) {
            if (res.confirm) {
              wx.request({
                url: 'https://www.weiwoju.com/Wxa/DeliveryWxa/addressDel',
                data: {
                  session_rd: session_rd,
                  id: id,
                  ver_no: wx.getStorageSync("edition")
                },
                success: function (res) {                 
                  if (id == that.data.address.id){

                    for (let i=0;i<that.data.address_list.length;i++){
                      if(that.data.address_list[i].id==id){
                        if(i==0){
                          i=1;
                        }
                        console.log(that.data.address_list[i-1]);
                        // that.add_address(that.data.address_list[i - 1].id)
                        wx.request({
                          url: 'https://www.weiwoju.com/Wxa/DeliveryWxa/addressUse',
                          data: {
                            id: that.data.address_list[i - 1].id,
                            session_rd: session_rd,
                            ver_no: wx.getStorageSync("edition")
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
                  that.get_address(that.data.shop_id);
                  // that.get_address();
                },
                fail: function (res) { console.log(res) }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
            return;
          }
        })
      
    },
    show_add: function (e) {
        var id = e.currentTarget.dataset.id;
        if (id) {
            this.setData({
                add: "block"
            })
        } else {
            var url = '../address/address';
            wx.redirectTo({
                url: url
            })
        }
    },
    bj_address: function (e) {
        var data = e.currentTarget.dataset.address;
        var address = JSON.stringify(data);
        var url = '../addressEdit/addressEdit?address=' + address + '';
        wx.navigateTo({
            url: url
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
        var url = '../address/address';
        wx.navigateTo({
            url: url,
            success:function(res){
            },
            fail:function(res){

            }
        })
    },
    menu() {
        var all = this.data.menu;
        var shop = this.data.shop;
        for (let i = 0; i < all.length; i++) {
            shop.push({
                id: all[i].id,
                style_id: all[i].style_id || 0,
                num: all[i].num
            })
        }
        this.setData({
            shop: shop
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
      console.log(limit)
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
    // 会员登录
    sign:function(){
      this.setData({
        Member:false
      })
    },

    get_tel: function (e) {
      if (e.detail.value != "") {
        this.setData({
          tel: e.detail.value,
        })
      }
    },
    set_code: function (e) {
      if (e.detail.value != "") {
        this.setData({
          code: e.detail.value,
        })
      }
    },
    // 获取验证码
    get_code:function(){
     var flag= this.data.flag
     var that=this;
      if(flag==false){
        return ;
      }
      this.setData({
        flag: false
      })
      wx.request({
        url: "https://www.weiwoju.com/Wxa/DeliveryWxa/getVipSmsCode",
        data: {
          session_rd: wx.getStorageSync('session_rd'),
          shop_id: that.data.shop_id,
          tel:that.data.tel
        },
        success:function(res){
          if (res.data.errcode == 0) {
            var twinkle = setInterval(function () {
              if (that.data.second == 0) {
                clearInterval(twinkle);
              }
              var a = that.data.number--;
              that.setData({
                second: a
              })
            }, 1000)
            setTimeout(function () {
              that.setData({
                flag: true,
                number:60
              })
            }, 60000)
          }else{
            wx.showModal({
              title: '提示',
              content: res.data.errmsg,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  that.setData({
                    flag: true
                  })
                }
                return;
              }
            });
          }
        }
      })
    },
    determine:function(){
      var that=this;
      wx.request({
        url: "https://www.weiwoju.com/Wxa/DeliveryWxa/bindVip",
        data: {
          session_rd: wx.getStorageSync('session_rd'),
          shop_id: that.data.shop_id,
          tel: that.data.tel,
          message_code: that.data.code
        }, 
        success: function (res) {
          if (res.data.errcode == 0) {
            that.setData({
              wallet: res.data.wallet,
              sign_info:'余额'+res.data.wallet,
              Member: true
            })
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.errmsg,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {}
              return;
            }
          });
        }
        }
        })
    },
    radioChange: function (e) {
      console.log(e)
      this.setData({
        paymethod: e.detail.value
      })
    },
        //   下单支付
    place_order: function () {
      if (this.data.address.status == "unabled"&&this.data.address.id) {
          wx.showModal({
            title: '提示',
            content: '该地址超出配送范围,无法下单',
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
        if (this.data.i == 1) {
            return;
        }
        this.setData({
            i: 1
        })
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

          if (this.data.wallet != '' && this.data.wallet>=this.data.total){
            this.setData({
              payhid: false
            }) 
          }else{
            this.payment('微信支付')
          }
        
      
        }
    },
  deter_pay:function(){
    this.setData({
      payhid: true
    })
    var payme = this.data.paymethod;
    this.payment(payme)
  },

  paym_hid:function(){
    this.setData({
      payhid:true,
      i: 0
    })
  },
  //下单支付接口
  payment:function(pay){
    this.setData({
      hidden: false
    });
    var address_id = this.data.address.id;
    var shop = this.data.shop;
    var prolist = [], i;
    for (i = 0; i < shop.length; i++) {
      if (shop[i].num > 0) {
        prolist.push({
          id: shop[i].id,
          num: shop[i].num,
          style_id: shop[i].style_id || 0
        });
      }
    }
    var that = this;
    var coupon_id = this.data.coupon.id;
    var session_rd = wx.getStorageSync('session_rd');
    wx.request({
      url: "https://www.weiwoju.com/Wxa/DeliveryWxa/placeOrder",
      header: {
        'Accept': 'application/json'
      },
      data: {
        address_id: address_id,
        coupon_id: coupon_id,
        delivery_price: that.data.delivery_price,
        people_num: that.data.eat_num || 1,
        remark: that.data.remarks || '',
        session_rd: session_rd,
        prolist: prolist,
        pay_method: pay,
        ver_no: wx.getStorageSync("edition")
      },
      success: function (res) {
        if (res.data.errcode == 12) {
          app.Login();
          that.place_order();
        }
        that.setData({
          hidden: true,
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
        if (res.data.pay_method == "余额支付") {
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 2000
          });
          var order_id = res.data.order_id;
          setTimeout(function(){
            wx.removeStorageSync('shopcar' + that.data.shop_id);
            var url = '../orderlist/orderlist?id=' + order_id + '&&state=' + 1 + '';
            wx.redirectTo({
              url: url
            })
          },2000)
        } else {
          wx.hideLoading();
          var pay_info = res.data.pay_info;
          var order_id = res.data.order_id;
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
              console.log(that.data.shop_id);
              wx.removeStorageSync('shopcar' + that.data.shop_id);
              var url = '../orderlist/orderlist?id=' + order_id + '&&state=' + 1 + '';
              wx.redirectTo({
                url: url
              })
            },
            fail: function (res) {
              wx.removeStorageSync('shopcar' + that.data.shop_id);
              var url = '../orderlist/orderlist?id=' + order_id + '&&state=' + 1 + '';
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

      }
    })
  },

    get_address(id) {
        var session_rd = wx.getStorageSync('session_rd');
        var  that = this;
        var shop_id=id;
        wx.request({
            url: 'https://www.weiwoju.com/Wxa/DeliveryWxa/currentOrder?t='+Math.random(),
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
                if (res.data.customer_coupon) {
                  if (res.data.customer_coupon.length > 0) {
                    that.setData({
                      coupon_text: '您有' + res.data.customer_coupon.length + '张优惠券'
                    })
                  }
                }
                if (res.data.address.status == "unabled"&&res.data.address.id){
                  wx.showModal({
                    title: '提示',
                    content: '该地址超出配送范围,无法下单',
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                        that.setData({
                          wsx:false
                        })

                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                      return;
                    }
                  })
                 
                } else if (res.data.address.id == undefined){
                  wx.showModal({
                    title: '提示',
                    content: '您未添加地址,请添加地址',
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                        that.setData({
                          wsx: false
                        })

                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                      return;
                    }
                  })
                }
                that.setData({
                  address: res.data.address,
                  vip: res.data.vip,
                  delivery_price:res.data.delivery_price,
                  delivery_pre_time: res.data.delivery_pre_time,
                  address_list: res.data.addresses,
                  customer_coupon: res.data.customer_coupon
                })
                if (res.data.vip.is_vip=="y"){
                  that.setData({
                    wallet: res.data.vip.wallet
                  })
                }
                that.total(res.data.delivery_price);
                if (res.data.address.status =='hidden'){
                  that.setData({ 
                    address: [],
                    address_list: res.data.addresses,
                    customer_coupon: res.data.customer_coupon });
                  
                }               
              }
            },
            fail: function (res) {
                console.log(res)
            },
        })
    },

    onLoad: function (option) {
            var options= JSON.parse(wx.getStorageSync('shop'));
            this.setData({
                shop_url: wx.getStorageSync('shop_url'),
                wsx:true
            });
            console.log(options)
            var prc=options.delivery_price;
            var free_price = options.delivery_free_price;
            this.shopcar(options.id);
            this.menu();
            this.package_total();
           
            console.log("onLoad");
            this.get_address(options.id);
            this.setData({
                shop_name: options.shop_name,
                shop_id: options.id,
                // delivery_price: parseFloat(prc),
                free_price: parseFloat(free_price),
                // delivery_pre_time: options.delivery_pre_time,
                full_subtract: options.full_subtract,
                catering: options.catering
            });
    },
    onReady: function () {
    },
    onShow: function () {
      if (wx.getStorageSync('addres')){
        console.log(wx.getStorageSync('addres'));
      var addres = JSON.parse(wx.getStorageSync('addres'));
      var that=this;    
      if(addres&&this.data.wsx!=true){
        var address_list = this.data.address_list||[];
        console.log(address_list);
        address_list.push({
          id: 0,
          name: addres[0].name,
          sex: addres[0].sex,
          tel: addres[0].call,
          address: addres[0].address
        })
        
        this.setData({
          address_list: address_list
        })
        
      
    }
      this.get_address(this.data.shop_id);
  }    
      // 页面显示
    },

})
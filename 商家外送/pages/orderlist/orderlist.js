var app = getApp()
Page({
  data: {
    goods: [],
    orders: [],
    oss: '',
    i: 0,
    id:0,
    tel:'',
    hid:'true',
    coupon:'',
    hidden: false,
  },
  coupons:function(){
    this.setData({
      hid:false,
    })
  },
  coupon_hid:function(){
    this.setData({
      hid: true,
    })
  },
  receive:function(event){
    var orderno = event.target.dataset.no;
    var id = event.target.dataset.id;
    var wxcard_id = event.target.dataset.card_id;
    var session_rd = wx.getStorageSync('session_rd');
    var that=this;
    console.log(orderno);
    console.log(id);
    wx.request({
      url: "https://www.weiwoju.com/Wxa/DeliveryWxa/customerGetCoupon",
      data:{
        coupon_id:id,
        order_no:orderno,
        session_rd: session_rd,
        ver_no: app.data.edition
      },
      success: function (res) {
        wx.addCard({
          cardList: [
            {
              cardId: wxcard_id,
              cardExt:res.data.couponInfo.cardExt
            }
          ],
          success: function (res) {
            console.log(res.cardList) // 卡券添加结果
          }
        });
        if (res.data.errcode == 1) {
          wx.showModal({
            title: '提示',
            content: res.data.errmsg,
            showCancel: false,
          })
        }
        that.setData({
          coupon: ''
        })
      },
      fail:function(res){
        console.log(res);
      }
    })
  
    this.setData({
      hid: true,
    })
  },
  getPayInfo: function (event) {
    if (this.data.i == 1) {
      return;
    }
    this.setData({
      i: 1
    })
    var that = this;
    var session_rd = wx.getStorageSync('session_rd');
    var no = event.target.dataset.no;
    console.log(session_rd);
    wx.request({
      url: "https://www.weiwoju.com/Wxa/DeliveryWxa/getPayInfo",
      data: {
        no: no,
        session_rd: session_rd,
        ver_no: app.data.edition
      },
      success: function (res) {
        if (res.data.errcode==1){
          wx.showModal({
            title: '提示',
            content: '订单已过期请重新下单',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                that.setData({
                  i: 0
                })
              }
              return;
            }
          })
         
        }
        if (res.data.errcode==0){
          var pay_info = res.data.pay_info;
          var order_id = res.data.order_id;
          console.log(pay_info);
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
              that.orderlist(order_id);
              console.log('支付成功');
            },
            fail: function (res) {
              console.log('支付失败' + res);
            },
            complete: function () {
              that.setData({
                i: 0
              })
            }
          });
        }
        
      }
    })
  },
  Cancel_order: function (event) {
    if (this.data.i == 1) {
      return;
    }
    this.setData({
      i: 1
    })
    var session_rd = wx.getStorageSync('session_rd');
    var no = event.target.dataset.no;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认取消订单',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://www.weiwoju.com/Wxa/DeliveryWxa/orderDeliveryCancel',
            data: {
              no: no,
              session_rd: session_rd,
              ver_no: app.data.edition
            },
            success: function (res) {
              that.setData({
                coupon: ''
              })
              if (res.data.errcode == 1) {
                wx.showModal({
                  title: '提示',
                  content: res.data.errmsg,
                  showCancel: false,
                })
              }
              wx.showToast({
                title: '取消成功',
                icon: 'success',
                duration: 2000
              });
              setTimeout(function () {
                // that.orderlist();
                that.orderlist(that.data.id, session_rd);
                // wx.navigateBack({
                //   delta: 1
                // })
              }, 2000);
            },
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
          that.setData({
            i: 0
          })
        }
        return;
      }
    })
   

  },
  orderlist: function (id,session_id) {
    var session_rd = session_id;
    var that = this;
    wx.request({
      url: 'https://www.weiwoju.com/Wxa/DeliveryWxa/orderInfo',
      data: {
        session_rd: session_rd,
        id: id,
        ver_no: app.data.edition
      },
      success: function (res) {  
        	if (res.data.errcode == 12) {
					that.Login(id);
					that.orderlist(id,wx.getStorageSync('session_rd'));
          } else if (res.data.errcode == 1) {
            wx.showModal({
              title: '提示',
              content: res.data.errmsg,
              showCancel: false,
            })
          }
          else if (res.data.errcode == 0){
            that.setData({
              hidden: true,
              goods: res.data.order.prolist,
              orders: res.data.order,
              oss: res.data.oss,
              tel: res.data.order.tel,
              coupon: res.data.coupon
            })
          } 
        
      },
    });
  },
  onLoad: function (options) {
    console.log(options);
    console.log(options.state);

    this.setData({
      id: options.id,
      state: options.state
    })
    // this.orderlist(options.id)
     var that = this;
    	if (wx.getStorageSync('session_rd') == false || wx.getStorageSync('session_rd') == '') {
			wx.login({
				success: function (res) {//登录成功
					if (res.code) {
						var code = res.code;
						wx.getUserInfo({//getUserInfo流程
							success: function (res2) {//获取userinfo成功
								var encryptedData = encodeURIComponent(res2.encryptedData);//加密串转成URI编码
								var iv = res2.iv;
								//请求服务器
								wx.request({
									url: 'https://www.weiwoju.com/Wxa/DeliveryWxa/login',
									data: {
										code: code,
										encryptedData: encryptedData,
										iv: iv,
                    ver_no: app.data.edition
									},
									method: 'GET',
									header: {
										'content-type': 'application/json'
									}, // 设置请求的 header
									success: function (res3) {
										var session_rd = res3.data.session_rd;
										that.orderlist(options.id,session_rd);
										wx.setStorageSync('session_rd', session_rd);
									},
									fail: function (res) {
										console.log(res);
									}
								});
							},
							fail: function (res) {
								console.log(res);
								wx.request({
									url: 'https://www.weiwoju.com/Wxa/DeliveryWxa/login',
									data: {
										code: code,
                    ver_no: app.data.edition
									},
									method: 'GET',
									header: {
										'content-type': 'application/json'
									}, // 设置请求的 header
									success: function (res3) {
										var session_rd = res3.data.session_rd;
										that.orderlist(options.id,session_rd);
										wx.setStorageSync('session_rd', session_rd);
									},
									fail: function (res) {
										console.log(res);
									}
								});
							}
						})
					} else {
						console.log('获取用户登录态失败！' + res.errMsg)
					}
				},
				fail: function (res) {
					console.log('登录失败' + res);
				}
			});
		} else {
			that.orderlist(options.id,wx.getStorageSync('session_rd'));
		}
    // 生命周期函数--监听页面加载
  },
  call:function(){
    var that=this;
    wx.makePhoneCall({
      phoneNumber:that.data.tel
    })
  },
  jx_order:function(){
    var id=this.data.orders.shop_id
    var name=this.data.orders.shop_name
      wx.redirectTo({
          url: '../index/index?id='+id+'&&name='+name+''
        })
  },
  Login: function (id) {
    var that = this;
    wx.login({
      success: function (res) {//登录成功
        if (res.code) {
          var code = res.code;
          wx.getUserInfo({//getUserInfo流程
            success: function (res2) {//获取userinfo成功
              var encryptedData = encodeURIComponent(res2.encryptedData);//加密串转成URI编码
              var iv = res2.iv;
              var appid = that.data.appid;
              //请求服务器
              wx.request({
                url: 'https://www.weiwoju.com/Wxa/DeliveryWxa/login',
                data: {
                  code: code,
                  encryptedData: encryptedData,
                  iv: iv,
                  appid: appid,
                  ver_no: app.data.edition
                },
                method: 'GET',
                header: {
                  'content-type': 'application/json'
                }, // 设置请求的 header
                success: function (res3) {
                  if (res3.data.errcode == 0) {
                    var session_rd = res3.data.session_rd;
                    console.log(res3.data.shop.company_name);
                    wx.setNavigationBarTitle({
                      title: res3.data.shop.company_name
                    });
                    wx.setStorageSync('shop_inf', JSON.stringify(res3.data.shop));
                    wx.setStorageSync('session_rd', session_rd);
                    that.orderlist(id, session_rd);
                  }
                },
                fail: function (res) {
                  console.log(res);
                }
              });

            },
            fail: function (res) {
              var appid = that.data.appid;
              wx.request({
                url: 'https://www.weiwoju.com/Wxa/DeliveryWxa/login',
                data: {
                  code: code,
                  appid: appid,
                  ver_no: app.data.edition
                },
                method: 'GET',
                header: {
                  'content-type': 'application/json'
                }, // 设置请求的 header
                success: function (res3) {
                  if (res3.data.errcode == 0) {
                    var session_rd = res3.data.session_rd;
                    wx.setStorageSync('shop_inf', JSON.stringify(res3.data.shop));
                    wx.setStorageSync('session_rd', session_rd);
                    that.orderlist(id, session_rd);
                  } else {
                    alert(res3.data.errmsg);
                  }
                },
                fail: function (res) {
                  console.log(res);
                }
              });
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      },
      fail: function (res) { console.log(res); }
    });
  },
  returned: function () {
   
    if (this.data.state==1){
      wx.redirectTo({
        url: '../orders/orders'
      })
    }else{
      wx.navigateBack({
        delta: 1
      })
    }
    
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示

  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },

})
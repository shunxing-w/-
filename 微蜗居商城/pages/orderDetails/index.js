
var app = getApp()
Page({
  data: {
    goods: [],
    orders: [],
    oss: '',
    i: 0,
    id: 0,
    tel: '',
    hid: 'true',
    coupon: '',
    hidden: true,
    items: [
      { name: '我不想买了', value: '我不想买了',checked: 'true'  },
      { name: '信息填写错误，重新拍', value: '信息填写错误，重新拍'},
      { name: '卖家缺货', value: '卖家缺货' },
      { name: '同城见面交易', value: '同城见面交易' },
      { name: '其他原因', value: '其他原因' }
    ],
    reason:'我不想买了'
  },
  coupons: function () {
    this.setData({
      hid: false,
    })
  },
  coupon_hid: function () {
    this.setData({
      hid: true,
    })
  },
  receive: function (event) {
    var orderno = event.target.dataset.no;
    var id = event.target.dataset.id;
    var wxcard_id = event.target.dataset.card_id;
    var session_rd = wx.getStorageSync('session_rd');
    var that = this;
    console.log(orderno);
    console.log(id);
    wx.request({
      url: "https://www.weiwoju.com/Wxa/ShoppingMallWxa/orderDetail",
      data: {
        coupon_id: id,
        order_no: orderno,
        session_rd: session_rd,
        ver_no: app.data.edition
      },
      success: function (res) {
        wx.addCard({
          cardList: [
            {
              cardId: wxcard_id,
              cardExt: res.data.couponInfo.cardExt
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
      fail: function (res) {
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
      url: "https://www.weiwoju.com/Wxa/ShoppingMallWxa/getPayInfo",
      data: {
        no: no,
        session_rd: session_rd
      },
      success: function (res) {
        if (res.data.errcode == 1) {
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
        if (res.data.errcode == 0) {
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
    this.setData({
      hid: false,
    })

  },
  radioChange: function (e) {
    this.setData({
      reason: e.detail.value
    })
  },
  Determine(){
    var session_rd = wx.getStorageSync('session_rd');
    var no = this.data.order.no;
    var reason = this.data.reason;
    var that = this;
    wx.request({
      url: 'https://www.weiwoju.com/Wxa/ShoppingMallWxa/cancelOrder',
      data: {
        no: no,
        session_rd: session_rd,
        reason: reason 
      },
      success: function (res) {
        that.setData({
          hid: true,
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
          // that.orderlist(that.data.id, session_rd);
          wx.switchTab({
            url: '/pages/index/index'
          })
        }, 2000);
      },
    });
  },
  confirm_receipt(event){
    var no = event.target.dataset.no;
    var session_rd = wx.getStorageSync('session_rd');
    var that = this;
    wx.request({
      url: 'https://www.weiwoju.com/Wxa/ShoppingMallWxa/confirmOrder',
      data: {
        session_rd: session_rd,
        no: no
      },
      success: function (res) {
        if (res.data.errcode == 12) {
          app.Login();
          that.orderlist(id, wx.getStorageSync('session_rd'));
        } else if (res.data.errcode == 1) {
          wx.showModal({
            title: '提示',
            content: res.data.errmsg,
            showCancel: false,
          })
        }else if (res.data.errcode == 0) {
          wx.showToast({
            title: '订单已完成',
            icon: 'success',
            duration: 2000
          });
          that.orderlist(that.data.id, session_rd);
        }

      },
    });
  },
  orderlist: function (id) {
  
    var that = this;
    wx.request({
      url: 'https://www.weiwoju.com/Wxa/ShoppingMallWxa/orderDetail',
      data: {
        session_rd: wx.getStorageSync('session_rd'),
        no: id
      },
      success: function (res) {
        if (res.data.errcode == 12) {
          app.Login();
          that.orderlist(id, wx.getStorageSync('session_rd'));
        } else if (res.data.errcode == 1) {
          wx.showModal({
            title: '提示',
            content: res.data.errmsg,
            showCancel: false,
          })
        }
        else if (res.data.errcode == 0) {
          that.setData({
            hidden: true,
            goods: res.data.order.prolist,
            order: res.data.order,
            oss: res.data.oss,
            tel: res.data.order.tel,
            coupon: res.data.coupon
          })
        }

      },
    });
  },
  onLoad: function (options) {
    this.setData({
      shop_info: JSON.parse(wx.getStorageSync('shop_info')) 
    })
    if (options){
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
                            that.orderlist(options.no)
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
                            that.orderlist(options.no)
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
        })
      }
    } else {
      this.orderlist(options.no)
    }
    }
    // 生命周期函数--监听页面加载
  },
  call: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.tel
    })
  },
  jx_order: function () {
    var id = this.data.order.no
    var name = this.data.orders.shop_name
    wx.redirectTo({
      url: '../logistics/index?id='+id
    })
  },
  returned: function () {

    if (this.data.state == 1) {
      wx.redirectTo({
        url: '../orderList/index'
      })
    } else {
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
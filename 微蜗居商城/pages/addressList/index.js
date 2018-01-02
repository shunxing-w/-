// pages/addressList/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address_list:[],
    address:'',
    add:'block'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  get_address(id) {
    var session_rd = wx.getStorageSync('session_rd');
    var that = this;
    var shop_id = id;
    wx.request({
      url: 'https://www.weiwoju.com/Wxa/ShoppingMallWxa/myAddress?t=' + Math.random(),
      data: {
        session_rd: session_rd,
        shop_id: shop_id,
        ver_no: wx.getStorageSync("edition")
      },
      success: function (res) {
        if (res.data.errcode == 12) {
          app.Login();
          that.get_address(id);
        }
        if (res.data.errcode == 0) {
          console.log(res.data.addresses)
          for (let i = 0; i < res.data.addresses.length; i++) {
            if (res.data.addresses[i].default == 1) {
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

  // 选择地址
  add_address: function (e) {
    var add_id = e.currentTarget.dataset.add_id;
    var status = e.currentTarget.dataset.status;
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
        that.get_address(that.data.shop_id);
        // that.get_address();
      },
      fail: function (res) { console.log(res) }
    })
    this.setData({
      // address:address,
      add: "none"
    })
  },
  // 删除地址
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
            url: 'https://www.weiwoju.com/Wxa/ShoppingMallWxa/addressDel',
            data: {
              session_rd: session_rd,
              id: id,
              ver_no: wx.getStorageSync("edition")
            },
            success: function (res) {
              if (id == that.data.address.id) {

                for (let i = 0; i < that.data.address_list.length; i++) {
                  if (that.data.address_list[i].id == id) {
                    if (i == 0) {
                      i = 1;
                    }
                    console.log(that.data.address_list[i - 1]);
                    // that.add_address(that.data.address_list[i - 1].id)
                    wx.request({
                      url: 'https://www.weiwoju.com/Wxa/ShoppingMallWxa/addressUse',
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
  returned: function () {
    var url = '../address/address';
    wx.navigateTo({
      url: url,
      success: function (res) {
      },
      fail: function (res) {

      }
    })
    // wx.chooseAddress({
    //   success: function (res) {
    //     console.log(res);
    //     console.log(res.userName)
    //     console.log(res.postalCode)
    //     console.log(res.provinceName)
    //     console.log(res.cityName)
    //     console.log(res.countyName)
    //     console.log(res.detailInfo)
    //     console.log(res.nationalCode)
    //     console.log(res.telNumber)
    //   }
    // })
  },
  onLoad: function (options) {
    // this.get_address(43469)
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
    this.get_address(43469)
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
  onShareAppMessage: function () {
  
  }
})
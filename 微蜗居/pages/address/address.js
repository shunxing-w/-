// pages/address/address.js
var app = getApp();
Page({
  data: {
    all: [],
    bj_add: [],
    yztel: '',
    address: '',
    latitude: '',
    longitude: '',
  },
  formSubmit: function (e) {
    var name = e.detail.value.name;
    var sex = e.detail.value.sex;
    var call = e.detail.value.dh;
    var address1 = e.detail.value.dz1;
    var address2 = e.detail.value.dz2;
    var sexs = '';
    var all = [];
    var latitude = this.data.latitude;
    var longitude = this.data.longitude;
    console.log(latitude);
    if (name == '' || sex == '' || call == '' || address1 == '') {
      //  alert("请完整填写收货地址信息")
      wx.showModal({
        title: '提示',
        content: '请完整填写收货地址信息',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    else {
      if (sex == 0) { sexs = "男"; } if (sex == 1) { sexs = "女"; }
      var session_rd = wx.getStorageSync('session_rd');
      wx.request({
        url: 'https://www.weiwoju.com/WechatApplet/addressAdd',
        data: {
          session_rd: session_rd,
          name: name,
          sex: sexs,
          tel: call,
          address: address1 + address2,
          latitude: latitude,
          longitude: longitude,
          ver_no: app.data.edition
        },
        success: function (res) {
          console.log(res)
          all.push({
            id: res.data.id,
            name: name,
            sex: sex,
            call: call,
            address: address1 + address2,
            sex: sexs,
          });
          wx.navigateBack({
            delta: 1
          });
          wx.setStorageSync('addres',JSON.stringify(all));
        }
      });

    }
  },

  address_map: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          address: res.address,
          latitude: res.latitude,
          longitude: res.longitude,
        })
      },
      canel: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  tel(e) {
    var tel = e.detail.value;
    var reg = "^1[3|4|5|8][0-9]\\d{8}$";
    var re = new RegExp(reg);
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数    
  },
  onReady: function () {

    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})
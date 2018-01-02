// pages/address/address.js
var tcity = require("../../utils/citys.js");
var app = getApp();
Page({
  data: {
    all: [],
    bj_add: [],
    yztel: '',
    address: '',
    latitude: '',
    longitude: '',
    condition: true,
    value: [0, 0, 0],
    values: [0, 0, 0]
  },
  formSubmit: function (e) {
    console.log(e)
    var name = e.detail.value.name;
    var call = e.detail.value.dh;
    var address = e.detail.value.dz;
    var address1 = e.detail.value.dz1;
    var values = this.data.values;
    var citys = this.data.city;
    var countys = this.data.county;
    var provinces = this.data.province;
    var all = [];
    if (name == '' || call == '' || address1 == '') {
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
    }else {
      wx.request({
        url: 'https://www.weiwoju.com/Wxa/ShoppingMallWxa/addressAdd',
        data: {
          session_rd: wx.getStorageSync('session_rd'),
          name:name,
          tel:call,
          prov: provinces,
          city: citys,
          country: countys,
          address: address1,
        },
        success: function (res) {
          console.log(res);
        }
      })
      wx.setStorageSync('addres', JSON.stringify(all));
      var session_rd = wx.getStorageSync('session_rd');
      wx.navigateBack({
        delta: 1
      });
    }
  },

  address_map: function () {
    var that = this;
    // wx.chooseLocation({
    //   success: function (res) {
    //     that.setData({
    //       address: res.address,
    //       latitude: res.latitude,
    //       longitude: res.longitude,
    //     })
    //   },
    //   canel: function (res) {
    //     console.log(res);
    //   },
    //   fail: function (res) {
    //     console.log(res);
    //   }
    // })
  },
  tel(e) {
    var tel = e.detail.value;
    var reg = "^1[3|4|5|8][0-9]\\d{8}$";
    var re = new RegExp(reg);
  },
  confirm:function(){
    var citys = this.data.city;
    var countys = this.data.county;
    var provinces = this.data.province;
    console.log(provinces + '-' + citys + '-' + countys)
    this.setData({
      address_ct: provinces + '-' + citys + '-' + countys,
      condition: !this.data.condition
    })
  },
  bindChange: function (e) {
    console.log(this.data.cityData);
    var val = e.detail.value
    var t = this.data.values;
    console.log(t);
    var cityData = this.data.cityData;
    console.log(val);
    if (val[0] != t[0]) {

      const citys = [];
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }

      this.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys: citys,
        county: cityData[val[0]].sub[0].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], 0, 0]
      })

      return;
    }
    if (val[1] != t[1]) {
      console.log('city no');
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }

      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) {
      this.setData({
        county: this.data.countys[val[2]],
        values: val
      })
      return;
    }


  },
  open:function () {
    this.setData({
      condition: !this.data.condition
    })
  },
  
  onLoad: function (options) {
    var session_rd = wx.getStorageSync('session_rd');
    var that=this;
    tcity.init(that);
    var cityData = that.data.cityData;
    const provinces = [];
    const citys = [];
    const countys = [];
    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
    }
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i].name)
    }
    for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[0].sub[0].sub[i].name)
    }
    that.setData({
      'provinces': provinces,
      'citys': citys,
      'countys': countys,
      'province': cityData[0].name,
      'city': cityData[0].sub[0].name,
      'county': cityData[0].sub[0].sub[0].name
    })
  //  wx.request({
  //    url: 'https://www.weiwoju.com/Wxa/ShoppingMallWxa/chooseLocation',
  //       data: {
  //         session_rd: session_rd
  //       },
  //       success: function (res) {
  //         const provinces = res.data.province;
  //         const citys = res.data.city;
  //         const countys = res.data.district;
  //         that.setData({
  //           'provinces': provinces,
  //           'citys': citys,
  //           'countys': countys,
  //           'cityData':res.data
  //         })
  //       }
  //     })
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
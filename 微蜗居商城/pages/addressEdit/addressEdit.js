// pages/addressEdit/addressEdit.js
var tcity = require("../../utils/citys.js");
var app = getApp();
Page({
    data:{
    all:[],
    bj_add:[],
    latitude: '',
    longitude: '',
    hidde:true,
    address_ct:'',
    address:'',
    condition: true,
    value: [0, 0, 0],
    values: [0, 0, 0]
  },
  formSubmit: function(e) {
     var id= e.detail.value.id;
    var name= e.detail.value.name;
    var call= e.detail.value.dh;
    var address = e.detail.value.dz2;
    var address1 = e.detail.value.dz1;
    var values = this.data.values;
    var citys = this.data.city;
    var countys = this.data.county;
    var provinces = this.data.province;
    var sexs = '';
    var all = [];
    var latitude = this.data.latitude;
    var longitude = this.data.longitude;
    var add_id = this.data.bj_add.id;
   var session_rd = wx.getStorageSync('session_rd');
  wx.request({
    url: 'https://www.weiwoju.com/Wxa/ShoppingMallWxa/addressEdit', 
    data: {
      session_rd:session_rd,
      id:id,
      name: name,
      tel: call,
      prov: provinces,
      city: citys,
      country: countys,
      address: address,
    },
    success: function(res) {
      console.log(res)
      wx.navigateBack({
        delta: 1
      })
      
    }
  })
    
  },
  // 滚动选择城市
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
      console.log('county no');
      this.setData({
        county: this.data.countys[val[2]],
        values: val
      })
      return;
    }


  },
  confirm: function () {
    var values = this.data.values;
    var citys = this.data.city;
    var countys = this.data.county;
    var provinces = this.data.province;
    console.log(provinces + '-' + citys + '-' + countys)
    this.setData({
      address_ct: provinces + '-' + citys + '-' + countys,
      condition: !this.data.condition
    })
  },
  open: function () {
    this.setData({
      condition: !this.data.condition
    })
  },
  onLoad:function(options){
    if(options){
        var addres=JSON.parse(options.address);
        console.log(addres);
       this.setData({
         bj_add:addres,
         address: addres.address,
         address_ct: addres.prov + '-' + addres.city + '-' +addres.country, 
         latitude: addres.latitude,
         longitude: addres.longitude
       })
     }
    var session_rd = wx.getStorageSync('session_rd');
    var that = this;
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
      'countys': countys
      // 'province': cityData[0].name,
      // 'city': cityData[0].sub[0].name,
      // 'county': cityData[0].sub[0].sub[0].name
    })
    // var session_rd = wx.getStorageSync('session_rd');
    // var that = this;
    // wx.request({
    //   url: 'https://www.weiwoju.com/Wxa/ShoppingMallWxa/chooseLocation',
    //   data: {
    //     session_rd: session_rd
    //   },
    //   success: function (res) {
    //     const provinces = res.data.province;
    //     const citys = res.data.city;
    //     const countys = res.data.district;
    //     that.setData({
    //       'provinces': provinces,
    //       'citys': citys,
    //       'countys': countys,
    //       'cityData': res.data
    //     })
    //   }
    // })
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})
// pages/addressEdit/addressEdit.js
var app = getApp();
Page({
    data:{
    all:[],
    bj_add:[],
    latitude: '',
    longitude: '',
    hidde:true,
    address:''
  },
  formSubmit: function(e) {
     var id= e.detail.value.id;
    var name= e.detail.value.name;
    var sex= e.detail.value.sex;
    var call= e.detail.value.dh;
    var address1 = e.detail.value.dz1;
    var address2 = e.detail.value.dz2;
    var sexs = '';
    var all = [];
    var latitude = this.data.latitude;
    var longitude = this.data.longitude;
    var add_id = this.data.bj_add.id;
   if(sex==0){sexs="男";}else{sexs="女";}
   all.push({
     id: add_id,
     name: name,
     sex: sex,
     call: call,
     address: address1 + address2,
     latitude: latitude,
     longitude: longitude,
     sex: sexs,
   });
   wx.setStorageSync('addres', JSON.stringify(all));
   var session_rd = wx.getStorageSync('session_rd');
  wx.request({
    url: 'https://www.weiwoju.com/Wxa/DeliveryWxa/addressEdit', 
    data: {
      session_rd:session_rd,
      id:id,
      name: name ,
      sex: sexs,
      tel:call,
      address: address1 + address2,
      latitude: latitude,
      longitude: longitude,
      ver_no: app.data.edition
    },
    success: function(res) {
      console.log(res)
      wx.navigateBack({
        delta: 1
      })
      
    }
  })
    
  },
  address_map: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        that.setData({
          hidde:false,
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
  onLoad:function(options){
    if(options){
        var addres=JSON.parse(options.address);
        console.log(addres);
       this.setData({
         bj_add:addres,
         address: addres.address,
         latitude: addres.latitude,
         longitude: addres.longitude
       })
     }
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
//app.js
var fundebug = require('./utils/fundebug.0.0.3.min.js');
fundebug.apikey = 'a5e4b15d15aa007d516a96b993d432a2f4a4e5107736df3dfc9c9f79b85ff22d';
App({
    data:{
      flag:'false',
      edition:'1.0',
      appid:''
    },
 test:function(){
   var that=this;
     wx.checkSession({
      success: function(res){
        console.log(res);//登录态未过期
        console.log("登录态未过期");
      },
      fail: function(res){
        // that.Login();
      }
  })
 },
 getid:function(that){
   if (wx.getExtConfig) {
     wx.getExtConfig({
       success: function (res) {
         console.log(res.extConfig.appid);
         that.setData({
           appid: res.extConfig.appid,
           edition: res.extConfig.version
         })

       }
     })
   }
 },
 fundebugs(){
   wx.getSystemInfo(
     {
       success: function (res) {
         fundebug.systemInfo = res;
       }
     })
   wx.getUserInfo(
     {
       success: function (res) {
         fundebug.userInfo = res.userInfo;
       }
     })
   fundebug.appVersion = "1.0.5";
   fundebug.metaData = {
     company:
     {
       appVersion: "1.0.5",
     }
   };
   
   
 },
 get_shopId(options){
   if (options.referrerInfo) {
     console.log(options)
     console.log(options.referrerInfo.extraData.id)
     var id = options.referrerInfo.extraData.id || options.query.id;
     wx.setStorageSync('id', id);
   }
 },
 
 onLaunch: function (options) {
    //调用API从本地缓存中获取数据
    this.fundebugs();
    this.get_shopId(options);
      
  },
 Login:function(id){ 
   var session_rd;
   var that=this;
   var id=id;
  
      wx.login({
       success: function (res) {//登录成功
    if (res.code) {
      var code = res.code;
      wx.getUserInfo({//getUserInfo流程
        success: function (res2) {//获取userinfo成功
     var encryptedData = encodeURIComponent(res2.encryptedData);//一定要把加密串转成URI编码
          var iv = res2.iv;
          //请求自己的服务器
      wx.request({
            url:'https://www.weiwoju.com/Wxa/DeliveryWxa/login',
            data: {
              code:code,
              appid:"wx4d3059b167d6a18a",
              encryptedData:encryptedData,
              shop_id:id,
              iv:iv
            },
            method: 'GET',
            header: {
              'content-type': 'application/json'
            }, // 设置请求的 header
            success: function (res3) {
              session_rd=res3.data.session_rd;
              wx.setStorageSync('shop_inf', JSON.stringify(res3.data.shop));
              wx.setStorageSync('session_rd', session_rd);
              console.log(res3);
            },
            fail:function(e){
              console.log(e);
            }
          })
        }
      })

    }
  },
  fail:function(res){
    console.log(res);
    console.log("失败");

  }
    });
 },
  globalData:{
    userInfo:null
  },
})
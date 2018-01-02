// pages/home/home.js
var fundebug = require('../../utils/fundebug.0.0.3.min.js');
fundebug.apikey = 'a5e4b15d15aa007d516a96b993d432a2f4a4e5107736df3dfc9c9f79b85ff22d';
var app = getApp();
Page({
	data: {
		shop: [],
		hidden: false,
		oss: '',
		errcode: 0,
    del_hid:false,
    delBtnWidth: 180,
    distance:0
	},
	shop_index: function (e) {
		var id = e.currentTarget.dataset.id;
		var name = e.currentTarget.dataset.name;
		wx.navigateTo({
			url: '../index/index?id=' + id + '&&name=' + name + ''
		})
	},
	get_session() {
		var session_rd = wx.getStorageSync('session_rd');
		if (session_rd == '') {
		} else {
			return session_rd;
		}
	},
	orders: function () {
		wx.navigateTo({
			url: '../orders/orders'
		})
	},
  //左滑删除
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项
      var index = e.target.dataset.index;
      // console.log(index);
      var list = this.data.shop;
      for(var i=0;i<list.length;i++){
        list[i].txtStyle = "left:0px"
      }
      if (index >= 0) {
        list[index].txtStyle = txtStyle;
        //更新列表的状态
        this.setData({
          shop: list
        });
      }
    }
  },

  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.target.dataset.index;
      var list = this.data.shop;
      if (index >= 0) {
        list[index].txtStyle = txtStyle;
        //更新列表的状态
        this.setData({
          shop: list
        });
      }
    }
  },
  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应
      // console.log(res);
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },
  
  //点击删除按钮事件
  delItem: function (e) {
    //获取列表中要删除项的下标
    var index = e.target.dataset.index;
    var shop_id = e.target.dataset.id;
    var list = this.data.shop;
    var that=this;
    wx.showModal({
      title: '提示',
      content: '删除该店铺后将不显示该店铺，确认删除吗？',
      success: function (res) {
        if (res.confirm) {
          //移除列表中下标为index的项

          console.log(index);
          list.splice(index, 1);
          //更新列表的状态
          that.setData({
            shop: list
          });
          wx.request({
            url: 'https://www.weiwoju.com/WechatApplet/ignoreShop',
            data: {
              shop_id: shop_id,
              session_rd: wx.getStorageSync('session_rd')
            },
            success: function (res) {
              console.log(res);
            },
            fail: function (res) {
              fundebug.notifyError(res);
            }
          });

        } else if (res.cancel) {
         console.log("取消失败");
        }
      }
    })
   
  },
 //请求商品数据
	test: function (session_rd) {
		var that = this;
		var session_id = session_rd;
		wx.getLocation({
			type: 'gcj02',
			success: function (res) {
				var latitude = res.latitude,
					longitude = res.longitude;
				wx.setStorageSync('latitude', latitude);
				wx.request({
					url: 'https://www.weiwoju.com/WechatApplet/shopList',
					method: 'GET',
					data: {
						session_rd: session_id,
						latitude: latitude,
						longitude: longitude
					},
					success: function (res) {
            if(res.data==''){
              wx.showModal({
                title: '提示',
                content: '错误:Error',
                success: function (res) {
                  if (res.confirm) {
                    //移除列表中下标为index的项
                  } else if (res.cancel) {
                    console.log("取消失败");
                  }
                }
              })
            }
						if (res.data.errcode == 12) {
							that.Login();
						
						} else if (res.data.errcode == 0) {
              console.log(app.data.edition);
							var shop = res.data.shop;
							for (var i = 0; i < shop.length; i++) {

								if (shop[i].distance) {
									if (shop[i].distance <= 100) {
										shop[i].distance = '<100m';
									} else if (shop[i].distance >= 1000 && shop[i].distance < 10000) {
										var distance = shop[i].distance;
										var min = distance.toString().substring(0, 1) + 'km';
										shop[i].distance = min;
									} else if (shop[i].distance >= 10000) {
										shop[i].distance = '>10km';
									} else {
										shop[i].distance = shop[i].distance + "m";
									}
								}else{
                  that.setData({
                    distance: 1,
                    errcode: 0
                  })
                }
                var arr=[];
                var s ={
                 mj:res.data.shop[i].full_subtract
                } 
                arr.push(s);;
                // var ss = s.split(",");
							}
             var s=res.data.shop[0].full_subtract;
              var ss = s.split(",");
              that.setData({
                hidden: true,
                shop: res.data.shop,
                oss: res.data.oss,
                errcode: res.data.errcode
              })
            } else if (res.data.errcode == 1){
							that.setData({
								errcode:res.data.errcode,
                hidden: true
							})
						}else{
              wx.showModal({
                title: '提示',
                content: res.data.errmsg,
                success: function (res) {
                  if (res.confirm) {
                    //移除列表中下标为index的项
                  } else if (res.cancel) {
                    console.log("取消失败");
                  }
                }
              })
            }
						
					},
					fail: function (res) {//获取店铺信息失败
            that.setData({
              hidden: true
            });
            fundebug.notifyError(res);
            wx.showModal({
              title: '提示',
              content: '获取店铺信息失败,请下拉刷新(检查你的网络）',
            })

					}
				})
			},
			fail: function (res) {//获取位置信息失败
        //console.log(res);
        console.log("获取位置失败");
        fundebug.notifyError(res);
        that.setData({
          hidden: true,
          errcode: 14
        });
			}
		});
	},
  //下拉刷新请求商品数据
	test2: function () {
    var that = this;
   
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude,
          longitude = res.longitude;
		
		wx.request({
			url: 'https://www.weiwoju.com/WechatApplet/shopList',
			method: 'GET',
			data: {
				session_rd: wx.getStorageSync('session_rd'),
        latitude: latitude,
        longitude: longitude
			},
			success: function (res) {
				if (res.data.errcode == 12) {
					that.Login();
					that.test2();
				}else if (res.data.errcode == 0) {
					var shop = res.data.shop;
					for (var i = 0; i < shop.length; i++) {
						if (shop[i].distance) {
							if (shop[i].distance <= 100) {
								shop[i].distance = '<100m';
							} else if (shop[i].distance >= 1000 && shop[i].distance < 10000) {
								var distance = shop[i].distance;
								var min = distance.toString().substring(0, 1) + 'km';
								shop[i].distance = min;
							} else if (shop[i].distance >= 10000) {
								shop[i].distance = '>10km';
							} else {
								shop[i].distance = shop[i].distance + "m";
							}
            } else {
              that.setData({
                distance: 1,
                errcode: 0
              })
            }
					}
				} else {
					that.setData({
						errcode: res.data.errcode
					})
				}	
				that.setData({
					hidden: true,
					shop: res.data.shop,
					oss: res.data.oss,
          errcode: res.data.errcode
				});
			},
      fail: function (res) {//获取店铺信息失败
        fundebug.notifyError(res);
        that.setData({
          hidden: true
        });
        wx.showModal({
          title: '提示',
          content: '获取店铺信息失败,请下拉刷新(检查你的网络）',
        })

      }
		});

    },
      fail: function (res) {//获取位置信息失败
        fundebug.notifyError(res);
        that.setData({
          hidden: true,
          errcode: 14
        });
      }
  })

	},
  achieve:function(){
    wx.openSetting({
      success: (res) => {
      }
    })
  },
	//下拉刷行
	onPullDownRefresh: function () {
		  // app.Login();
		if (wx.getStorageSync('latitude') == false || wx.getStorageSync('latitude') == '') {
			this.test(wx.getStorageSync('session_rd'));
		} else {
			this.test2();
		}
		setTimeout(function () {
			wx.stopPullDownRefresh();
		}, 1000);
	},
  Login: function (url1) {
    var session_rd;
    var that = this;
    var url = url1;
    console.log("重新登录");
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
                url: 'https://www.weiwoju.com/WechatApplet/login',
                data: {
                  code: code,
                  encryptedData: encryptedData,
                  iv: iv
                },
                method: 'GET',
                header: {
                  'content-type': 'application/json'
                }, // 设置请求的 header
                success: function (res3) {
                  session_rd = res3.data.session_rd;
                  that.test(session_rd);
                  wx.setStorageSync('session_rd', session_rd);
                  
                },
              })
            }
          })

        }
      },
      fail: function (res) {
        fundebug.notifyError(res);
      }
    });
  },
	onLoad: function (options) {
    this.initEleWidth();
    //如果没有登录发起登录
		if (wx.getStorageSync('session_rd') == false || wx.getStorageSync('session_rd') == '') {
			var that = this;
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
									url: 'https://www.weiwoju.com/WechatApplet/login',
									data: {
										code: code,
										encryptedData: encryptedData,
										iv: iv
									},
									method: 'GET',
									header: {
										'content-type': 'application/json'
									}, // 设置请求的 header
									success: function (res3) {
										var session_rd = res3.data.session_rd;
										that.test(session_rd);
										wx.setStorageSync('session_rd', session_rd);
									},
									fail: function (res) {
                    fundebug.notifyError(res);
									}
								});
							},
							fail: function (res) {
                fundebug.notifyError(res);
								wx.request({
									url: 'https://www.weiwoju.com/WechatApplet/login',
									data: {
										code: code
									},
									method: 'GET',
									header: {
										'content-type': 'application/json'
									}, // 设置请求的 header
									success: function (res3) {
										var session_rd = res3.data.session_rd;
										that.test(session_rd);
										wx.setStorageSync('session_rd', session_rd);
									},
									fail: function (res) {
                    fundebug.notifyError(res);
									}
								});
							}
						})
					} else {
						console.log('获取用户登录态失败！' + res.errMsg)
					}
				},
				fail: function (res) {
          fundebug.notifyError(res);
					console.log('登录失败1' + res);
          app.Login();
          
				}
			});
		} else {
			this.test(wx.getStorageSync('session_rd'));
		}
   

		if (wx.openBluetoothAdapter) {
			wx.openBluetoothAdapter()
		} else {
			wx.showModal({
				title: '提示',
				content: '当前微信版本过低，可能影响部分功能使用，建议升级到微信最新版本。'
			})
		}
	},
  
	onReady: function () {
		var that = this;
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
	},
	onShareAppMessage: function () {
		// 用户点击右上角分享
		var that = this;
		return {
			title: '商家外送小程序',
			desc: '商家外送',
			path: '/pages/home/home'
		}
	},
  
})
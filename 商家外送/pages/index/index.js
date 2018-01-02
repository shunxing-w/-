//index.js

var app = getApp()
Page({
	data: {
		hidden: false,
		shop_name: '',
		curNav: 1,
		curIndex: 0,
    cate_num:0,
		// swth: 0,//搜索页面宽度
		sedpn: "none",
		greet: "none",
		show: "none",
		ys: '',
		qjs: '',
		shop: [],
		spec_num: '',
		shopcar: [],
		spec_current: [],
    enable: { delivery_limit:0, text: '去结算' },
		opening: 'y',
		start_price: 0,
		total: 0,
		shopcar_num: 0,
		navList: [],
		dishesList: [],
		index: 0,
		package_total: 0,
		delivery_price: 0,
    shop_id:'',
    oss:'',
    shop_list:[],
    stae:true
	},
	loadingChange() {
		setTimeout(() => {
			this.setData({
				hidden: true
			})
		}, 800)
	},
	selectNav(event) {
		let id = event.target.dataset.id,
			index = parseInt(event.target.dataset.index),
      shop_id=this.data.shop_id,
      sessionid=wx.getStorageSync('session_rd');
    this.get_productlist(shop_id, id, sessionid)
		var that = this;
		that.setData({
			curNav: id,
			curIndex: index
		});
	},
	// 打开规格弹窗
	spec: function (event) {
		var shop = event.currentTarget.dataset.shop;
		if (shop == 1) {
			this.setData({
				sedpn: "block"
			});
		} else {
			this.data.spec_current = shop;
			var spec_current = this.data.spec_current;
			if (spec_current.id == shop.id) {
				console.log(shop.prostyle[0].style_id);
				spec_current.style_id = shop.prostyle[0].style_id;
			}
			spec_current.style_name = shop.prostyle[0].style_name;
			spec_current.price = shop.prostyle[0].style_price;
			spec_current.num = this.get_spec_bought_num(shop.id, spec_current.style_id);
			// this.get_bought_spec_total_num(shop.id)
			// 和localStorage 合并
			this.setData({
				sedpn: "block",
				spec_current: spec_current
			});
		}
	},
	// 选择某个规格
	set_spec: function (event) {
		var style = event.currentTarget.dataset.style;
		var good = event.currentTarget.dataset.specid;
		var spec_current = this.data.spec_current;
		spec_current.style_id = style.style_id;
		spec_current.style_name = style.style_name;
		spec_current.price = style.style_price;
		spec_current.num = this.get_spec_bought_num(good, style.style_id);
		this.setData({
			spec_current: spec_current
		})
		var style_id = event.currentTarget.dataset.styleid;
		if (style_id == style.id) {
			this.setData({
				ys: "#f44336"
			})
		} else {
			this.setData({
				ys: ""
			})
		}
		// 获取合并 当前购物车中的 规格商品数量
	},
	close: function (event) {
		this.spec_current = [];
		this.setData({
			sedpn: "none"
		})
	},
	// 去结算超过起送费，点击实现页面跳转
  Myorder: function (event) {
    var total = event.currentTarget.dataset.total;
    var url = '../Order/order?shop_id='+this.data.shop.id;
    if (parseFloat(total) >= parseFloat(this.data.enable.delivery_limit) && this.data.enable.text == "去结算" && parseFloat(total) >0) {
      wx.navigateTo({
        url: url
      })
    }
  },
	get_spec_bought_num: function (good_id, style_id) {
		var all = this.data.shopcar;
		var num = 0;
		for (let i = 0; i < all.length; i++) {
			var el = all[i];
			if (el.index.indexOf(good_id + '|' + style_id + '|') != -1) {
				num += el.num;
			}
		};
		return num;
	},
	// 获取规格商品的数量
	get_bought_spec_total_num: function (good_id) {
		var all = this.data.shopcar;
		var spec_num = 0;
		for (let i = 0; i < all.length; i++) {
			var el = all[i];
			if (el.id == good_id) {
				spec_num += el.num;
			}
		};
		return spec_num;
	},
  //获取分类的商品数量
  get_cate_num:function(cate_id){
    var all = this.data.shopcar;
    var spec_num = 0;
    for (let i = 0; i < all.length; i++) {
      var el = all[i];
      if (el.cate_id == cate_id) {
        spec_num += el.num;
      }
  };
    return spec_num;
  },
	spec_plus: function (event) {
		var good = event.currentTarget.dataset.current;
		this.plus(good);
		var spec_current = this.data.spec_current
		spec_current.num = this.get_spec_bought_num(good.id, this.data.spec_current.style_id);
		this.setData({
			spec_current: spec_current
		})
	},
	spec_minuse: function (event) {
		var good = event.currentTarget.dataset.current;
		this.minuse(good);
		var spec_current = this.data.spec_current;

		spec_current.num = this.get_spec_bought_num(good.id, this.data.spec_current.style_id);
		this.setData({
			spec_current: spec_current
		})
	},
  cho_shop(e){    
    var id = e.currentTarget.dataset.id;
    this.get_shop(id, wx.getStorageSync('session_rd'));
    this.setData({
      stae:true
    })
    
  },
	// 选择菜品（点击+号事件）
	selectDish(event) {
		var shop = event.currentTarget.dataset.shop;
		var id = shop.id;
		var style_id = shop.style_id || 0;
		var name = shop.name || "";
		var attr = shop.attr || '';
		var num = parseInt(num) || 1;
		var all = this.read();
		var price = shop.price || 0;
		var exist = null;
    var cate_id =shop.cate_id||null;
		var exist_key;
		// 找之前购物车中已有商品 区分商品id、规格和属性
		for (let i = 0; i < all.length; i++) {
			var v = all[i];
			// console.log(v)
			if (v.index == id + '|' + style_id + '|' + attr) {
				exist = v;
				exist_key = i;
			}
		};
		if (exist != null) {
			exist.num += num;
			all[exist_key] = exist;
			// console.log(exist)
		} else {
			all.push({
        cate_id:cate_id,
				id: id,
				index: id + '|' + style_id + '|' + attr,
				name: shop.name,
				price: price,
				style_id: shop.style_id,
				style_name: shop.style_name,
				package_price: shop.package_price,
				num: num,
			});
		}
		this.save(all);
		this.merge();

	},
	//（点击-号事件）
	reduction: function (event) {
		var shop = event.currentTarget.dataset.shop;
		var id = shop.id;
		var style_id = shop.style_id || 0;
		var attr = shop.attr || '';
		var num = num || 1;
		var all = this.read();
		var exist = null;
		var exist_key;
		// 找之前购物车中已有商品 区分商品id、规格和属性
		for (let i = 0; i < all.length; i++) {
			var v = all[i];
			if (v.index == id + '|' + style_id + '|' + attr) {
				exist = v;
				exist_key = i;
			}
		};
		if (exist) {
			if (exist.num == 0) {
				return;
			}
			exist.num -= num;
			all[exist_key] = exist;
			this.save(all);
			this.merge();
		}
	},
	plus: function (good) {
    var cate_id = good.cate_id || null;
		var id = good.id;
		var style_id = good.style_id || 0;
		var name = good.name || "";
		var attr = good.attr || '';
		var num = parseInt(num) || 1;
		var all = this.read();
		var price = good.price || 0;
		var exist = null;
		var exist_key;
		// 找之前购物车中已有商品 区分商品id、规格和属性
		for (let i = 0; i < all.length; i++) {
			var v = all[i];
			if (v.index == id + '|' + style_id + '|' + attr) {
				exist = v;
				exist_key = i;
			}
		};
		if (exist != null) {
			exist.num += num;
			all[exist_key] = exist;
		} else {
			all.push({
        cate_id: cate_id,
				id: id,
				index: id + '|' + style_id + '|' + attr,
				name: good.name,
				price: price,
				style_id: good.style_id,
				style_name: good.style_name,
				package_price: good.package_price,
				num: num,
			});
		}
		this.save(all);
		this.merge();
	},
	minuse: function (good) {
		var id = good.id;
		var style_id = good.style_id || 0;
		var attr = good.attr || '';
		var num = num || 1;
		var all = this.read();
		var exist = null;
		var exist_key;
		// 找之前购物车中已有商品 区分商品id、规格和属性
		for (let i = 0; i < all.length; i++) {
			var v = all[i];
			if (v.index == id + '|' + style_id + '|' + attr) {
				exist = v;
				exist_key = i;
			}
		};
		if (exist) {
			if (exist.num == 0) {
				return;
			}
			exist.num -= num;
			all[exist_key] = exist;
			this.save(all);
			this.merge();
		}
	},
	gwc_plus: function (event) {
		var good = event.currentTarget.dataset.good;
		var id = good.id;
		var style_id = good.style_id || 0;
		var name = good.name || "";
		var attr = good.attr || '';
		var num = parseInt(num) || 1;
		var all = this.read();
		var price = good.price || 0;
		var exist = null;
    var cate_id = good.cate_id || null;
		var exist_key;
		// 找之前购物车中已有商品 区分商品id、规格和属性
		for (let i = 0; i < all.length; i++) {
			var v = all[i];
			if (v.index == id + '|' + style_id + '|' + attr) {
				exist = v;
				exist_key = i;
			}
		};
		if (exist != null) {
			exist.num += num;
			all[exist_key] = exist;
		} else {
			all.push({
        cate_id: cate_id,
				id: id,
				index: id + '|' + style_id + '|' + attr,
				name: good.name,
				price: price,
				style_id: good.style_id,
				style_name: good.style_name,
				package_price: good.package_price,
				num: num,
			});
		}
		this.save(all);
		this.merge();
	},
	gwc_minuse: function (event) {

		var good = event.currentTarget.dataset.good;
		var id = good.id;
		var style_id = good.style_id || 0;
		var attr = good.attr || '';
		var num = num || 1;
		var all = this.read();
		var exist = null;
		var exist_key;
		// 找之前购物车中已有商品 区分商品id、规格和属性
		for (let i = 0; i < all.length; i++) {
			var v = all[i];
			// console.log(v)
			if (v.index == id + '|' + style_id + '|' + attr) {
				exist = v;
				exist_key = i;
			}
		};
		if (exist) {
      if(exist.num==0){
        return;
      }else{
        exist.num -= num;
        all[exist_key] = exist;
        this.save(all);
        this.merge();
      }
			
		}
	},
	read: function (key) {
		var key = 'shopcar' + this.data.shop.id || 'shopcar';
		if (key == 'shopcar' + this.data.shop.id) {
			if (wx.getStorageSync(key) != '') {
				this.data.shopcar = JSON.parse(wx.getStorageSync(key)) || [];
			} else {
				this.data.shopcar = wx.getStorageSync(key) || [];
			}
		}
		if (wx.getStorageSync(key) != '') {
			return JSON.parse(wx.getStorageSync(key)) || [];
			console.log(JSON.parse(wx.getStorageSync(key)));
		} else {
			return wx.getStorageSync(key) || [];
		}
	},
	save: function (data, key) {
		var key = 'shopcar' + this.data.shop.id || 'shopcar';
		return wx.setStorageSync(key, JSON.stringify(data));
	},
	clearCar: function () {
		var that = this;
		wx.showModal({
			title: '提示',
			content: '确认清空购物车？',
			success: function (res) {
				if (res.confirm) {
					wx.removeStorageSync('shopcar' + that.data.shop.id);
					that.data.shopcar = [];
					var dishesList = that.data.dishesList;
					for (var index = 0; index < dishesList.length; index++) {
						if (dishesList[index].style_num) {
							dishesList[index].style_num = 0
						}
					}
					that.setData({
            greet:'none',
						dishesList: dishesList
					})
					that.merge();
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})

	},
	// 合并购物车数量和列表数量

	merge() {
		var CarData = this.data.dishesList;
    var CateData = this.data.navList;
		this.read();
		var shops = this.read();
		var spec_current = this.data.spec_current;

		for (let index = 0; index < CarData.length; index++) {
			// alert(goods);
			if (shops.length) {
				for (let i = 0; i < shops.length; i++) {
					if (shops[i].id == CarData[index].id) {
						CarData[index].num = shops[i].num;
						//  CarData[index].style_num = shops[i].style_num;						
					}
					if (CarData[index].id == shops[i].id) {
						CarData[index].style_num = this.get_bought_spec_total_num(CarData[index].id);
					}
				};
			} else {
				CarData[index].num = 0;
			}
		};
    for (let i=0;i < CateData.length;i++){
      CateData[i].cate_num = this.get_cate_num(CateData[i].id);;
    }
		this.setData({
			dishesList: CarData,
			shopcar: shops,
      navList: CateData
		})
		this.total();
		this.shopcar_num();
		this.package_total();
    
	},
	//选菜数量及总价
	package_total: function () {
		var all = this.data.shopcar;
		var total = 0;
		if (all.length) {
			for (let index = 0; index < all.length; index++) {
				var el = all[index];
				total += el.num * el.package_price;
			};
		}
		this.setData({
			package_total: total
		})
	},
	total: function () {
    var that=this;
		var all = this.data.shopcar;
		var total = 0;
		var package_total = 0;
		var enable = this.data.enable;
    var delivery_limit = this.data.shop.delivery_limit||0;
		if (all.length) {
			for (let i = 0; i < all.length; i++) {
				total += all[i].num * all[i].price;
				package_total += all[i].num * all[i].package_price;
			};
		}
		if (this.data.shop.work_status == "否") {
			enable.class = '';
			enable.text = '休息中';
			that.setData({
				enable: enable
			});
		}
		else if (delivery_limit == '0') {
			if (total == 0) {
				this.setData({
					qjs: ""
				});
				enable.text = '去结算';
			} else {
				if ((total + package_total) >= delivery_limit) {
					this.setData({
						qjs: "qjs"
					});
					enable.text = '去结算';
				} else {
					this.setData({ qjs: "" });
					enable.text = "￥" + delivery_limit + '起送';
				}
			};
		} else {
			if ((total + package_total) >= delivery_limit) {
				this.setData({
					qjs: "qjs"
				});
				enable.text = '去结算';
			} else {
				this.setData({ qjs: "" });
				enable.text = "￥" + delivery_limit + '起送';

			}
		}
		this.setData({
			enable: enable
		});
		var num = (total + package_total).toFixed(2);
		this.setData({
      total: parseFloat(num)
    })
		return (total + package_total).toFixed(2);
	},
	//合并购物车数量和列表数量
	shopcar_num: function () {
		var all = this.data.shopcar;
		var num = 0;
		var s = 0;
		for (let i = 0; i < all.length; i++) {
			if (all[i].num > 0) {

				s = s + all[i].num;
				num = num + all[i].num;
			}
		};
		this.setData({
			shopcar_num: num
		})
	},
	greet: function (event) {

    if (this.data.greet == 'block' && this.data.shopcar=='') {
			this.setData({
				greet: "none"
			})
		} else {
			this.setData({
				greet: "block"
			})
		}
	},
	close: function (event) {
		this.setData({
			sedpn: "none"
		})
	},
	gwc_close: function (e) {
		var name = e.currentTarget.dataset.name;
		if (name == 1) {
			this.setData({
				sedpn: "none"
			})
		} else {
			this.setData({
				greet: "none"
			})
		}

	},
  orderlist:function(){
    var url = '../orders/orders'
      wx.navigateTo({
        url: url
      })
  },

  // 点击显示大图
	// details: function (event) {
	// 	var shop_index = event.target.dataset.index;
	// 	var dishe = event.target.dataset.dish;
	// 	console.log(dishe);
	// 	console.log(shop_index);
	// 	if (shop_index != undefined) {
	// 		this.setData({
	// 			show: "block",
	// 			index: shop_index
	// 		})
	// 	}

	// },
	clear: function () {
		this.setData({
			show: "none",
		})
	},
  // 请求商品列表
  get_productlist(shop_id,cate_id,sessionid) {
    if (this.data.hidden==true){
      this.setData({
        hidden:false
      })
    } 
    var that = this;
    var session_rd = sessionid;
    wx.request({
      url: 'https://www.weiwoju.com/Wxa/DeliveryWxa/getProductList',
      method: 'GET',
      data: {
        cate_ids: cate_id,
        shop_id: shop_id,
        session_rd: session_rd,
        ver_no: app.data.edition
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.errcode == 12) {
          that.Login();
          that.get_shop(shop_id, wx.getStorageSync('session_rd'));
          return;
        } if (res.data.errcode == 0){
          if (res.data.prolist) {

            // that.loadingChange();
            that.setData({
              hidden:true,
              dishesList: res.data.prolist,
              xq_conter: res.data.prolist
            })
            that.merge();
          }
        }
        if (res.data.errcode == 1) {
          that.loadingChange();
          that.setData({
            dishesList: [],
          })
          wx.showModal({
            title: '提示',
            content: res.data.errmsg,
            showCancel: false,
          })
        }
       
      }
    })
  },
	get_shop(shop_id,sessionid) {
    var that = this;
    var session_rd = sessionid;
    var enable = this.data.enable;
    // console.log(wx.getStorageSync("shop_inf"));
    var shop_inf=JSON.parse(wx.getStorageSync("shop_inf")); 
    var shop_id = shop_id||shop_inf.id;
        wx.request({
          url: 'https://www.weiwoju.com/Wxa/DeliveryWxa/shoppingCar?shop_id=' + shop_id,
          method: 'GET',
          data: {
            session_rd: session_rd,
            ver_no: app.data.edition
          },
          header: {
            'Accept': 'application/json'
          },
          success: function (res) {
            if (res.data.errcode == 12) {
              that.Login();
              return;
            }
            else if (res.data.errcode == 1) {
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: res.data.errmsg,
                success: function (res) {
                  
                }
              })
            }
            else if (res.data.errcode == 0) {
              wx.setNavigationBarTitle({
                title: res.data.shop.shop_name
              });
              if (res.data.catelist) {
                that.get_productlist(shop_id, res.data.catelist[0].id, wx.getStorageSync('session_rd'));
              }
              var shop_url = res.data.shop.shoplogo_url;
              wx.setStorageSync('shop_url', shop_url);
              var prolist = res.data.prolist;
              var shop = res.data.shop;
              wx.setStorageSync('shop', JSON.stringify(shop));
              console.log(res.data.shop.work_status);
              if (res.data.shop.work_status == "是") {
                if (res.data.shop.delivery_limit == '0') {
                  that.setData({
                    qjs: ""
                  });
                  enable.text = '去结算';
                } else {
                  that.setData({
                    qjs: "",

                  });
                  enable.delivery_limit = shop.delivery_limit;
                  enable.text = "￥" + shop.delivery_limit + '起送';
                }
                that.setData({
                  enable: enable
                });
              } else if (res.data.shop.work_status == "否") {
                enable.class = '';
                enable.text = '休息中';
                that.setData({
                  enable: enable
                });
              }
              that.loadingChange();
              that.setData({
                delivery_price: res.data.shop.delivery_price,
                shop: res.data.shop,
                shop_id:shop_id,
                navList: res.data.catelist,
                curNav: res.data.catelist[0].id,
                oss: res.data.oss
              })
            }
          }
        })
	},
	onLoad: function (options) {
    if (wx.getExtConfig) {
      wx.getExtConfig({
        success: function (res) {
          console.log(res.extConfig.appid);
          that.setData({
            appid: res.extConfig.appid,
            edition: res.extConfig.version
          })
          wx.setStorageSync('edition', res.extConfig.version);
        }
      })
    }
    if(wx.getStorageSync('id')){
      var shopId = wx.getStorageSync('id');
      wx.removeStorageSync('id');
      console.log(shopId);
    }else{
      var shopId = ""; 
    }
  console.log(options);
		var that = this;
    if (options.id) {
      that.get_shop(options.id, wx.getStorageSync('session_rd'));
    }else {
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
                    shop_id: shopId,
                    ver_no: that.data.edition
                  },
                  header: {
                    'content-type': 'application/json'
                  }, // 设置请求的 header
                  success: function (res3) {

                    if (res3.data.errcode == 0) {
                      var session_rd = res3.data.session_rd;
                      wx.setStorageSync('shop_inf', JSON.stringify(res3.data.shop));
                      wx.setStorageSync('session_rd', session_rd);
                      if (res3.data.shop.length > 1) {
                        that.setData({
                          stae: false,
                          shop_list: res3.data.shop
                        })
                        that.loadingChange();
                      } else {
                        that.get_shop(res3.data.shop[0].id, session_rd);
                      }
                    } else {
                      wx.showModal({
                        title: '提示',
                        content: res3.data.errmsg,
                        showCancel: false,
                      })
                    }
                  },
                  fail: function (res) {
                    console.log(res);
                    // that.loadingChange();
                    wx.showLoading({
                      title: res
                    })
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
                    ver_no: that.data.edition
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
                      if (res3.data.shop.length > 1) {
                        that.setData({
                          stae: false,
                          shop_list: res3.data.shop
                        })
                        that.loadingChange();
                      } else {
                        that.get_shop(res3.data.shop[0].id, session_rd);
                      }
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
		}
    
	},
	onReady: function () {
		// 页面渲染完成
		
		// this.total();
		// this.shoplist();
		this.animation = wx.createAnimation({
			duration: 100,
			timingFunction: 'linear',	   
		})
	},
  shopList(){
    this.setData({
      stae:false
    })
    wx.setNavigationBarTitle({
      title: "请选择店铺"
    });
  },
  Login: function () {
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
                  ver_no: that.data.edition
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
                    if (res3.data.shop.length > 1) {
                      that.setData({
                        stae: false,
                        shop_list: res3.data.shop
                      })
                      that.loadingChange();
                    } else {
                      that.get_shop(res3.data.shop[0].id, session_rd);
                    }
                  } else {
                    alert(res3.data.errmsg);
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
                  ver_no: that.data.edition
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
                    if (res3.data.shop.length > 1) {
                      that.setData({
                        stae: false,
                        shop_list: res3.data.shop
                      })
                      that.loadingChange();
                    } else {
                      that.get_shop(res3.data.shop[0].id, session_rd);
                    }
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
	onShow: function () {
		var that = this;
    this.merge();
		// 页面显示
	},
	onHide: function () {
		// 页面隐藏
	},
	onUnload: function () {
		// 页面关闭
   
	},
	onPullDownRefresh: function () {
		// 页面相关事件处理函数--监听用户下拉动作
	},
	onReachBottom: function () {
		// 页面上拉触底事件的处理函数
	},
	onShareAppMessage: function () {
		// 用户点击右上角分享
		var that = this;
		return {
			title: that.data.shop.shop_name,
			desc: '',
			path: '/pages/index/index?id=' + this.data.shop.id + '&name=' + that.data.shop.shop_name + ''
		}
	},

}
);

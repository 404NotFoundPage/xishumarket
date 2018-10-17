var api = require('../../utils/pub.js');
var app = getApp();
var flag = true; //1
var flag1 = true; //2
Page({
  data: {
    height1: 320, //swi_p1高度
    height2: 320, //swi_p2高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    is_show: false,
    heig: 600,
    height: 0,
    datat: '', //推荐信息存放
    dataf: '', //附近信息存放
    p: 1, //推荐页码
    p1: 1, //附近页码
    latitude: '', //当前位置纬度
    longitude: '', //当前位置经度
    loadFlag: true,
    loadFlag1: true,
    JOIN_PHONE:"",   //加入电话
    JOIN_WEIXIN: "", //入驻微信
    bg_url: "",   //背景图片

    flag: true,
    i:1,
    time: '',
    timer: '',

    powerflag: true,   //授权模板;
    powerimgurl:"",//授权头像;
  },
//授权请求事件
index:function(){
  wx.switchTab({
    url: '../index/index',
    success: function (e) {
      var page = getCurrentPages().pop();
      console.log(page);
      if (page == undefined || page == null) return;
      page.onLoad();
    }
  })
},
b1: function (e) {
  var that = this;
  if (e.detail.userInfo){
    //用户按了允许授权按钮
    console.log(e);
    // if ( !app.globalData.userInfo ){    //可能会出错的地方;
    //    app.Loagin();
    //   }
    api.bindGetUserInfo(e, that,callback);
      function callback(res) {
        if( that.data.pwdpageurl && res.ret == '0' ){
          wx.navigateTo({
            url:that.data.pwdpageurl,
          })
        } else {
          //用户按了拒绝按钮
        }
      }
    }
},

  onLoad: function(options) {
    var that = this;
    // 判断是否授权  
    // wx.clearStorage();
    var thirdsesid = api.getThirdsesid();
    if (thirdsesid != '' && thirdsesid != undefined) {
      //查看当前位置
      if (that.data.latitude == '' || that.data.latitude == undefined){
        wx.getLocation({
          type: 'wgs84',
          success: function (res) {
            var latitude = res.latitude
            var longitude = res.longitude
            that.setData({
              latitude: latitude,
              longitude: longitude
            })
            console.log(latitude, longitude);
            var p = that.data.p;
            var data = {
              p: p,
              thirdsesid: thirdsesid,
            }
            api.store(that, p, data, callback);
            function callback(res){
              if (res.ret == '0') {
                that.setData({
                  JOIN_PHONE:res.service.phone,
                  bg_url: res.service.shop_pic,
                  JOIN_WEIXIN: res.service.weixin,
                })
                if (res.data.length != 0) {
                  for (var i = 0; i < res.data.length; i++) {
                    if (res.data[i].distance > 0) {
                      res.data[i].distance1 = (res.data[i].distance / 1000).toFixed(2);
                    } else {
                      res.data[i].distance1 = res.data[i].distance;
                    }
    
                  }
                  that.setData({
                    datat: res.data,
                    p: that.data.p += 1
                  })
                  console.log(that.data.datat);
                } else {
                  flag = false;
                  wx.showToast({
                    title: '没有更多数据了',
                    // image: '../image/error.png',
                    icon: 'none',
                    duration: 2000
                  })
                }
              } else {
                console.log('错误提示:' + res);
                that.setData({
                  JOIN_PHONE:res.service.phone,
                  bg_url: res.service.shop_pic,
                  JOIN_WEIXIN: res.service.weixin,
                })
                wx.showToast({
                  title: res.msg,
                  // image: '../image/error.png',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          },
          fail: function (res) {
            var p = that.data.p;
            var data = {
              p: p,
              thirdsesid: thirdsesid,
            }
            api.store(that, p, data, callback);
            function callback(res){
              if (res.ret == '0') {
                that.setData({
                  JOIN_PHONE:res.service.phone,
                  bg_url: res.service.shop_pic,
                  JOIN_WEIXIN: res.service.weixin,
                })
                if (res.data.length != 0) {
                  for (var i = 0; i < res.data.length; i++) {
                    if (res.data[i].distance > 0) {
                      res.data[i].distance1 = (res.data[i].distance / 1000).toFixed(2);
                    } else {
                      res.data[i].distance1 = res.data[i].distance;
                    }
    
                  }
                  that.setData({
                    datat: res.data,
                    p: that.data.p += 1
                  })
                  console.log(that.data.datat);
                } else {
                  flag = false;
                  wx.showToast({
                    title: '没有更多数据了',
                    // image: '../image/error.png',
                    icon: 'none',
                    duration: 2000
                  })
                }
              } else {
                console.log('错误提示:' + res);
                that.setData({
                  JOIN_PHONE:res.service.phone,
                  bg_url: res.service.shop_pic,
                  JOIN_WEIXIN: res.service.weixin,
                })
                wx.showToast({
                  title: res.msg,
                  // image: '../image/error.png',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          }
        });
      }
    } else {
      // wx.navigateTo({
      //   url: '../accredit/accredit',
      // })
      app.onLaunch(); //获取code;
      api.imgurl(that)
      that.setData({
        powerflag: false,
      })
    }
      var query = wx.createSelectorQuery();
      query.select('#swi_p1').boundingClientRect(function(rect) {
        // console.log(rect);
        that.setData({
          height1: rect.height + 40
        })
      }).exec();
      //设置swi_p1高度

      that.demo('#swi_p1')

  },
  demo:function( selectDom ){
    let that = this;
    var query = wx.createSelectorQuery();
    let i= that.data.i
    console.log(i)
    // clearInterval( t );
    let t = setInterval(function(){
        query.select(selectDom).boundingClientRect(function(rect) {
          i++;
          that.setData({
            height1: rect.height + 40
          })
        }).exec();
        that.setData({
          timer: t,
          i: i,
        })
        // console.log(that.data.i+"___"+i+"____"+that.data.height1);
        if( that.data.i > 400 ){
          clearInterval( that.data.timer );
          that.setData({
            i: 1,
          })
        }
      } , 500)
  },

  onShow: function () {
    let that = this;
    //下面是很可能会出问题的地方;
    wx.checkSession({
      success: function () {
        //session_key 未过期，并且在本生命周期一直有效
        if( !api.getThirdsesid() ){
          console.log("session_key 未过期并且getThirdsesid不存在")
          app.onLaunch()
          api.imgurl(that)
          //  wx.navigateTo({
          //    url:"../accredit/accredit"
          //  })
          that.setData({
            powerflag: false,
          })
        }else{
          console.log("session_key 未过期并且getThirdsesid存在")
          that.setData({
            powerflag: true,
          })
          that.onLoad();
        }
        return;
      },
      fail: function () {
        console.log("session_key已经失效，需要重新执行登录流程")
        // session_key 已经失效，需要重新执行登录流程
        app.onLaunch()
        api.imgurl(that)
        //  wx.navigateTo({
        //    url:"../accredit/accredit"
        //  })
        that.setData({
          powerflag: false,
        })
      }
    })
  },
  onHide: function () {
    
  },
  onPullDownRefresh: function() { //下拉刷新
    var that = this;
    var pd = that.data.currentTab; //0第一页,1第二页
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    flag = true;
    flag1 = true;
    that.setData({
      p: 1,
      p1: 1,
      currentTab: pd
    }) //重新确定p
    if (pd == 0 && flag) {
      var p = that.data.p;
      var thirdsesid = api.getThirdsesid();
      var data = {
        p: p,
        thirdsesid: thirdsesid,
      } 
      api.store(that, p, data, callback);
      function callback(res) {
        if (res.ret == '0') {
          if (res.data.length != 0) {
            for (var i = 0; i < res.data.length; i++) {
              if (res.data[i].distance > 0) {
                res.data[i].distance1 = (res.data[i].distance / 1000).toFixed(2);
              } else {
                res.data[i].distance1 = res.data[i].distance;
              }
            }
            that.setData({
              datat: res.data,
              p: that.data.p += 1
            })
            console.log(that.data.datat);
          } else {
            flag = false;
            wx.showToast({
              title: '没有更多数据了',
              // image: '../image/error.png',
              icon: 'none',
              duration: 2000
            })
          }

        } else {
          wx.showToast({
            title: res.msg,
            // image: '../image/error.png',
            icon: 'none',
            duration: 2000
          })
          flag = true;
        }
      }

      var query = wx.createSelectorQuery();
      //设置swi_p1高度
      setTimeout(function() {
        query.select('#swi_p1').boundingClientRect(function(rect) {
          // console.log(rect);
          that.setData({
            height1: rect.height + 40
          })
        }).exec();
      }, 1000)
    } else if (pd == 1 && flag1) {
      var p = that.data.p1;
      var thirdsesid = api.getThirdsesid();
      var data = {
        p: p,
        around: 1,
        lat: that.data.latitude,
        lng: that.data.longitude,
        thirdsesid: thirdsesid
      }
      api.store(that, p, data, callback);
      function callback(res) {
        if (res.ret == '0') {
          if (res.data.length != 0) {
            for (var i = 0; i < res.data.length; i++) {
              if (res.data[i].distance > 0) {
                res.data[i].distance1 = (res.data[i].distance / 1000).toFixed(2);
              } else {
                res.data[i].distance1 = res.data[i].distance;
              }

            }
            that.setData({
              dataf: res.data,
              p1: that.data.p1 += 1
            })
            console.log(that.data.dataf);
          } else {
            flag1 = false;
            wx.showToast({
              title: '没有更多数据了',
              // image: '../image/error.png',
              icon: 'none',
              duration: 2000
            })
          }

        } else if (res.ret == '1') {
          if (res.address == '1') {
            //重新请求当前位置
            wx.getLocation({
              type: 'wgs84',
              success: function(res) {
                var latitude = res.latitude
                var longitude = res.longitude
                that.setData({
                  latitude: latitude,
                  longitude: longitude
                })
                console.log(latitude, longitude);
              },
              fail: function(res) {
                console.log(res);
              }
            });
          }
          wx.showToast({
            title: res.msg,
            // image: '../image/error.png',
            icon: 'none',
            duration: 2000
          })
        }
      }
      var query = wx.createSelectorQuery();
      //设置swi_p2高度
      setTimeout(function() {
        query.select('#swi_p2').boundingClientRect(function(rect) {
          // console.log(rect);
          that.setData({
            height2: rect.height + 40
          })
        }).exec();
      }, 1000)
    }


  },
  onReachBottom: function() {
    var that = this;
    var pd = that.data.currentTab; //0第一页,1第二页

    console.log(flag, flag1);
    if (pd == 0 && flag) {
      console.log(that.data.p);
      var p = that.data.p;
      var thirdsesid = api.getThirdsesid();
      var data = {
        p: p,
        thirdsesid: thirdsesid,
      };
      api.storetMore(that, p, data, callback);

      function callback(res) {
        if (res.ret == '0') {
          if (res.data.length != 0) {
            for (var i = 0; i < res.data.length; i++) {
              if (res.data[i].distance > 0) {
                res.data[i].distance1 = (res.data[i].distance / 1000).toFixed(2);
              } else {
                res.data[i].distance1 = res.data[i].distance;
              }

            }
            that.setData({
              datat: that.data.datat.concat(res.data),
              p: that.data.p += 1
            })

            console.log(that.data.datat);
          } else {
            flag = false;
            wx.showToast({
              title: '没有更多数据了',
              // image: '../image/error.png',
              icon: 'none',
              duration: 2000
            })
          }

        } else {
          wx.showToast({
            title: res.msg,
            // image: '../image/error.png',
            icon: 'none',
            duration: 2000
          })
          flag = true;
        }
      }

      var query = wx.createSelectorQuery();
      //设置swi_p1高度
      setTimeout(function() {
        query.select('#swi_p1').boundingClientRect(function(rect) {
          // console.log(rect);
          that.setData({
            height1: rect.height + 40
          })
        }).exec();
      }, 1000)

    } else if (pd == 1 && flag1) {
      console.log(that.data.p1);
      var p = that.data.p1;
      var thirdsesid = api.getThirdsesid();
      var data = {
        p: p,
        around: 1,
        lat: that.data.latitude, //当前位置纬度
        lng: that.data.longitude,
        thirdsesid: thirdsesid
      };
      api.storetMore(that, p, data, callback);

      function callback(res) {
        if (res.ret == '0') {
          if (res.data.length != 0) {
            for (var i = 0; i < res.data.length; i++) {
              if (res.data[i].distance > 0) {
                res.data[i].distance1 = (res.data[i].distance / 1000).toFixed(2);
              } else {
                res.data[i].distance1 = res.data[i].distance;
              }

            }
            that.setData({
              dataf: that.data.dataf.concat(res.data),
              p1: that.data.p1 += 1
            })
            console.log(that.data.dataf);
          } else {
            flag1 = false;
            wx.showToast({
              title: '没有更多数据了',
              // image: '../image/error.png',
              icon: 'none',
              duration: 2000
            })
          }

        } else {
          wx.showToast({
            title: res.msg,
            // image: '../image/error.png',
            icon: 'none',
            duration: 2000
          })
          flag1 = true;
        }
      }

      var query = wx.createSelectorQuery();
      //设置swi_p2高度
      setTimeout(function() {
        query.select('#swi_p2').boundingClientRect(function(rect) {
          // console.log(rect);
          that.setData({
            height2: rect.height + 40
          })
        }).exec();
      }, 1000)

    }

  },
  copy: function(e) { //复制
    var self = this;
    this.setData({
      is_show: false
    });
    wx.setClipboardData({
      data: self.data.JOIN_WEIXIN,
      success: function(res) {
        wx.showToast({
          title: '复制成功',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
      }
    });
  },
  switchTab: function(e) { // 滚动切换标签样式
    var that = this;
    var currentTab = e.detail.current;
    that.setData({
      currentTab: e.detail.current,
      p: 1,
      p1: 1
    });

    if (currentTab == '1') {
      var p = that.data.p1;
      var thirdsesid = api.getThirdsesid();
      var data = {
        p: p,
        around: 1,
        lat: that.data.latitude,
        lng: that.data.longitude,
        thirdsesid: thirdsesid
      }
      if (flag1) {
        api.store(that, p, data, callback);
      }

      function callback(res) {
        if (res.ret == '0') {
          if (res.data.length != 0) {
            for (var i = 0; i < res.data.length; i++) {
              if (res.data[i].distance > 0) {
                res.data[i].distance1 = (res.data[i].distance / 1000).toFixed(2);
              } else {
                res.data[i].distance1 = res.data[i].distance;
              }

            }
            that.setData({
              dataf: res.data,
              p1: that.data.p1 += 1
            })
            console.log(that.data.dataf);
          } else {
            flag1 = false;
            wx.showToast({
              title: '没有更多数据了',
              // image: '../image/error.png',
              icon: 'none',
              duration: 2000
            })
          }

        } else if (res.ret == '1') {
          if (res.address == '1') {
            //重新请求当前位置
            wx.getLocation({
              type: 'wgs84',
              success: function(res) {
                var latitude = res.latitude
                var longitude = res.longitude
                that.setData({
                  latitude: latitude,
                  longitude: longitude
                })
                console.log(latitude, longitude);
              },
              fail: function(res) {
                console.log(res);
              }
            });
          }
          wx.showToast({
            title: res.msg,
            // image: '../image/error.png',
            icon: 'none',
            duration: 2000
          })
          flag1 = true;
        }
        var query = wx.createSelectorQuery();
        //设置swi_p2高度
        setTimeout(function() {
          query.select('#swi_p2').boundingClientRect(function(rect) {
            // console.log(rect);
            that.setData({
              height2: rect.height + 40
            })
          }).exec();
        }, 300)
        // that.demo('#swi_p2')
      }
    } else {
      var p = that.data.p;
      var thirdsesid = api.getThirdsesid();
      var data = {
        p: p,
        thirdsesid: thirdsesid,
        lat: that.data.latitude,
        lng: that.data.longitude
      };
      if (flag) {
        api.store(that, p, data, callback);
      }

      function callback(res) {
        if (res.ret == '0') {
          if (res.data.length != 0) {
            for (var i = 0; i < res.data.length; i++) {
              if (res.data[i].distance > 0) {
                res.data[i].distance1 = (res.data[i].distance / 1000).toFixed(2);
              } else {
                res.data[i].distance1 = res.data[i].distance;
              }

            }
            that.setData({
              datat: res.data,
              p: that.data.p += 1
            })
            console.log(that.data.datat);
          } else {
            flag = false;
            wx.showToast({
              title: '没有更多数据了',
              // image: '../image/error.png',
              icon: 'none',
              duration: 2000
            })
          }

        } else {
          wx.showToast({
            title: res.msg,
            // image: '../image/error.png',
            icon: 'none',
            duration: 2000
          })
          flag = true;
        }
      }

      var query = wx.createSelectorQuery();
      //设置swi_p1高度
      setTimeout(function() {
        query.select('#swi_p1').boundingClientRect(function(rect) {
          // console.log(rect);
          that.setData({
            height1: rect.height + 40
          })
        }).exec();
      }, 1000)
    }

  },
  show: function() { //弹窗显示
    var he_;
    if (this.data.height == undefined) {
      this.setData({
        is_show: true
      });
      this.setData({
        heig: he_
      });
    } else {
      this.setData({
        is_show: true
      });
      this.setData({
        heig: this.data.height * 7 + 615
      });
      he_ = parseInt(this.data.height) * 7 + 615;
    }
  },
  call: function(e) { //电话
    this.setData({
      is_show: false
    });
    api.callTel(e);
  },
  go_details: function(e) { //页面跳转
    var id = e.currentTarget.dataset.id;
    try {
      wx.setStorageSync('shopid', id);
    } catch (e) {}
    wx.navigateTo({
      url: "../seller_info/seller_info",
    })
  },
  jumpgoods: function(e) { //跳转商品
    var id = e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '../goodDetails/goodDetails?id=' + id,
    })
  },
  hide: function() { //弹窗隐藏
    
    this.setData({
      is_show: false
    });
  },
  preventTouchMove: function(e) { //禁止页面滚动事件
    e.preventDefault();
  },
  clickTab: function(e) { // 点击标题切换当前页时改变样式
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        p: 1,
        p1: 1
      })
    }
    if (that.data.currentTab == '0') {
      var query = wx.createSelectorQuery();
      //设置swi_p1高度
      setTimeout(function() {
        query.select('#swi_p1').boundingClientRect(function(rect) {
          // console.log(rect);
          that.setData({
            height1: rect.height + 40
          })
        }).exec();
      }, 1000)
    } else {
      var query = wx.createSelectorQuery();
      //设置swi_p1高度
      setTimeout(function() {
        query.select('#swi_p2').boundingClientRect(function(rect) {
          // console.log(rect);
          that.setData({
            height2: rect.height + 40
          })
        }).exec();
      }, 1000)
    }
  }
})
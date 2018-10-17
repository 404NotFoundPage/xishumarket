var api = require('../../utils/pub.js');
var app = getApp();
Page({
  data: {
    shopid: '', //商铺id
    shop: '',
    goods: '',
    latitude: '', //定位的位置
    longitude: '',
    callnum: '', //打call人数,
    loadFlag: true,
    loadFlag1: true,
    shopphone: "", //商家电话;
    shop_tichtext: "", //商家介绍;

    powerflag: true, //授权模板;
    powerimgurl: "", //授权头像;
  },
  //授权请求事件
  index: function () {
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
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      console.log(e);
      // if ( !app.globalData.userInfo ){    //可能会出错的地方;
      //    app.Loagin();
      //   }
      api.bindGetUserInfo(e, that, callback);

      function callback(res) {
        if (that.data.pwdpageurl && res.ret == '0') {
          wx.navigateTo({
            url: that.data.pwdpageurl,
          })
        } else {
          //用户按了拒绝按钮
        }
      }
    }
  },




  onLoad: function (options) {
    // console.log(options);
    var that = this;
    var id = wx.getStorageSync('shopid') //店铺id;
    if (id == '' || id == undefined) {
      wx.switchTab({
        url: '../store/store',
      })
    } else {
      that.setData({
        shopid: id
      });
      // 判断是否授权  
      // wx.clearStorage();
      var thirdsesid = api.getThirdsesid();
      if (thirdsesid != '' && thirdsesid != undefined) {
        var data = {
          id: id,
          thirdsesid: thirdsesid,
        }
        api.sellmsg(that, data, callback);

        function callback(res) {
          // console.log(res);
          if (res.ret == '0') {
            let result = res.shop.introduce; //富文本图片宽度解决;
            const regex = new RegExp('<img', 'gi');
            result = result.replace(regex, `<img style="width: 100%;"`);
            that.setData({
              callnum: res.shop.call_count,
              shop: res.shop,
              goods: res.goods,
              shop_tichtext: result,
            });
          } else {
            wx.showToast({
              title: res.msg,
              // image: '../image/error.png',
              icon: 'none',
              duration: 2000
            })
          }
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
    }
  },
  onShow: function () {
    wx.showShareMenu({
      withShareTicket: true
    })

  },
  onHide: function () {

  },
  call: function (e) { //电话
    api.callTel(e);
  },
  callsum: function () {
    var that = this;
    var thirdsesid = api.getThirdsesid();
    wx.request({
      url: app.globalData.urls + 'Shop/MiniIndex/add_call',
      method: 'POST',
      data: {
        shopid: that.data.shopid,
        thirdsesid: thirdsesid
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        var res = res.data;
        // console.log(res);
        if (res.ret == '0') {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
          that.setData({
            callnum: parseInt(that.data.callnum) + 1
          });
        } else {
          wx.showToast({
            title: res.msg,
            // image: '../image/error.png',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })

  },
  click: function (e) { //地图
    var that = this;
    var points = that.data.shop.coor.split(',');
    var lat = points[1]; //纬度
    var lng = points[0]; //经度
    wx.openLocation({ //店家地址
      latitude: parseInt(lat),
      longitude: parseInt(lng),
      scale: 18,
      name: that.data.shop.name,
      address: that.data.shop.address
    })
    //查看当前位置
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          latitude: latitude,
          longitude: longitude
        })
        // console.log(latitude, longitude);
      },
      fail: function (res) {
        // console.log(res);
      }
    });
  },
  index_: function (e) {
    wx.switchTab({
      url: '../index/index'
    })
  },
  shop_: function (e) {
    wx.switchTab({
      url: '../store/store'
    })
  },
  user_: function (e) {
    wx.switchTab({
      url: '../user/user'
    })
  },
  href_details: function (e) {
    var id = e.currentTarget.dataset.id; //商品的id;
    try {
      wx.setStorageSync('id', id);
    } catch (e) {}
    console.log(id)
    wx.navigateTo({
      url: '../goodDetails/goodDetails?id=' + id,
      success(res) {
        console.log(res)
        if (res.errMsg == "navigateTo:ok") { //设置商品id进入缓存;
          wx.setStorageSync("id", id)
        }
      }
    })
  },
  onShareAppMessage: function (res) {
    var that = this;
    webViewUrl = res.webViewUrl; // 当前网页的 url
    console.log(webViewUrl);
    wx.showShareMenu({
      withShareTicket: true,
      success: function (res) {
        console.log(res);
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
        // console.log(res)
      }
    })
    return {
      title: that.data.shop.name,
      path: '/pages/seller_info/seller_info?id=' + that.data.shopid,
      imageUrl: 'http://7xoq3p.com1.z0.glb.clouddn.com/shope0264506cf0dffae0d38a90e86632c5c1530515483.png',
      success: function (res) {
        console.log(res.shareTickets[0]);
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: function (res) {
            console.log(res);
            var encryptedData = res.encryptedData;
            var iv = res.iv;
            var thirdsesid = wx.getStorageSync('thirdsesid');
            wx.request({
              url: app.globalData.urls + 'Shop/MiniIndex/shareSuccess',
              method: 'POST',
              data: {
                encryptedData: encryptedData,
                iv: iv,
                thirdsesid: thirdsesid
              },
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              success: function (res) {
                // console.log('gid');
                // console.log(res);
                var res = res.data;
                // console.log(JSON.parse(res.data));
              }
            })

          },
          fail: function (res) {
            // console.log(res)
          },
          complete: function (res) {
            // console.log(res)
          }
        })
      },
      fail: function (res) {
        // 分享失败
        // console.log(res)
      }
    }
  }
})
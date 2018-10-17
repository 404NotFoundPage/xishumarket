var app = getApp();

/**
 * 首页优选
 */
// function getpower(){
//   wx.navigateTo({
//     url: '../accredit/accredit',
//   })
// }
//优选初次请求
function index(that, p, data, callback) {
  loadstart(that);
  wx.request({
    url: app.globalData.urls + 'Shop/MiniIndex/index',
    method: 'POST',
    data: data,
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      console.log(res);
      var res = res.data;
      callback(res);
      // if (res.ret == '0') {
      //   if (res.data.length != 0) {
      //     that.setData({
      //       picArr: res.data,
      //       p: that.data.p += 1,
      //       down: false
      //     });
      //   } else {
      //     wx.showToast({
      //       title: '暂无数据',
      //       // image: '../image/error.png',
      //       icon: 'none',
      //       duration: 2000
      //     })
      //     that.setData({
      //       down: true
      //     })
      //   }
      // } else {
      //   // wx.showToast({
      //   //   title: res.msg,
      //   //   image: '../image/error.png',
      //   //   icon: 'none',
      //   //   duration: 2000
      //   // });
      //   wx.navigateTo({
      //     url: '../accredit/accredit',
      //   })
      // }
    },
    complete: function (res) {
      loadending(that);
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }
  })
}
// 优选加载更多
function indexMore(that, p, data, flag, callback) {
  if (flag) {
    // 显示加载图标
    loadstart1(that);
    console.log(that.data.p);
    wx.request({
      url: app.globalData.urls + 'Shop/MiniIndex/index',
      method: 'POST',
      data: data,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        wx.hideLoading();
        var res = res.data;
        callback(res);
      },
      complete: function (res) {
        loadending1(that);
      }

    })
  } else {
    that.setData({
      noinfoflag: false,  //显示没有更多数据;
    })
  }
}

/**
 * 商品详情
 */
//初始化请求
function goodsdetails(that, data, callback) {
  loadstart(that);
  //初始化加载
  wx.request({
    url: app.globalData.urls + 'Shop/MiniIndex/details',
    method: 'POST',
    data: data,
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      // console.log(res.data);                           
      var res = res.data;
      callback(res);
    },
    complete: function (res) {
      loadending(that);
    }
  })

}

//评论
function comment(that, data, callback) {
  loadstart1(that);
  wx.request({
    url: app.globalData.urls + 'Shop/MiniIndex/comment',
    method: 'POST',
    data: data,
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      console.log(res.data);
      var res = res.data;
      callback(res);
    },
    complete: function (res) {
      loadending1(that);
    }
  })
}
//评论加载更多
function commentmore(that, data, callback) {
  loadstart1(that);
  // console.log(that.data.p);
  wx.request({
    url: app.globalData.urls + 'Shop/MiniIndex/comment',
    method: 'POST',
    data: data,
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      console.log(res.data);
      var res = res.data;
      callback(res);
    },
    complete: function (res) {
      loadending1(that);
    }
  })
}

/**
 * 确认订单
 */
function conforder(that, data, callback) {
  loadstart(that);
  wx.request({
    url: app.globalData.urls + 'Shop/MiniIndex/order_details',
    method: 'POST',
    data: data,
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      console.log(res.data);
      var res = res.data;
      callback(res);
    },
    complete: function (res) {
      loadending(that);
    }
  })
}
//加载优惠卷
function loadcoupon(that, data, callback) {
  loadstart1(that);
  wx.request({
    url: app.globalData.urls + 'Shop/MiniIndex/myCoupons',
    method: 'POST',
    data: data,
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      console.log(res);
      var res = res.data;
      callback(res);
    },
    complete: function (res) {
      loadending1(that);
    }
  })
}
/**
 * 我的订单
 */
//订单初始化请求
function myorder(that, data, state, p, flag, callback1) {
  //初始化加载
  if (flag) {
    loadstart1(that);
    wx.request({
      url: app.globalData.urls + 'Shop/MiniIndex/order_lists',
      method: 'POST',
      data: data,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res);
        var res = res.data;
        callback1(res);
      },
      complete: function (res) {
        loadending1(that);
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  }

}

function orderLoadmore(that, data, state, p, flag, callback2) {
  if (flag) {
    console.log(that.data.p);
    loadstart1(that);
    wx.request({
      url: app.globalData.urls + 'Shop/MiniIndex/order_lists',
      method: 'POST',
      data: data,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res);
        var res = res.data;
        callback2(res);
      },
      complete: function (res) {
        loadending1(that);
      }
    })
  }
}
/**
 * 下单成功
 */
function orderdone(that, data, callback) {
  loadstart(that);
  wx.request({
    url: app.globalData.urls + 'Shop/MiniIndex/order_details',
    method: 'POST',
    data: data,
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      console.log(res.data);
      var res = res.data;
      callback(res);
    },
    complete: function (res) {
      loadending(that);
    }
  })
}
/**
 * store 好店请求
 */
function store(that, p, data, callback) {
  //初始化加载
  loadstart1(that);
  wx.request({
    url: app.globalData.urls + 'Shop/MiniIndex/shops',
    method: 'POST',
    data: data,
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      console.log(res);
      var res = res.data;
      callback(res);
    },
    complete: function () {
      loadending1(that);
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }
  });
}
//store 加载更多
function storetMore(that, p, data, callback) {
  loadstart1(that);
  wx.request({
    url: app.globalData.urls + 'Shop/MiniIndex/shops',
    method: 'POST',
    data: data,
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      console.log(res.data);
      var res = res.data;
      callback(res);
    },
    complete: function (res) {
      loadending1(that);
    }
  });
}

/**
 * 商家信息
 */
function sellmsg(that, data, callback) {
  loadstart(that);
  wx.request({
    url: app.globalData.urls + 'Shop/MiniIndex/shop_details',
    method: 'POST',
    data: data,
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      var res = res.data;
      callback(res);
      // console.log(that.data.callnum);
    },
    complete: function (res) {
      loadending(that);
    }
  })
}

/*
用户页面
*/
//判断是否手机绑定user页面
function isLogin(that, data) {
  loadstart(that); 
  wx.request({
    url: app.globalData.urls + 'Shop/MiniIndex/myCenter',
    method: 'POST',
    data: data,
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      console.log(res);
      var res = res.data;
      if (res.ret == '0') {
        that.setData({
          condition: false,
          datas: res.data,
          phonenum: res.data.phone,
          isshare: res.isshare
        })
        console.log(that.data.datas);
      } else {
        that.setData({
          condition: true
        })
        var pages = getCurrentPages() //获取加载的页面
        var currentPage = pages[pages.length - 1] //获取当前页面的对象
        var url = currentPage.route //当前页面url当前页面url
        wx.navigateTo({
          url: '../webview/webview?originurl=' + url,
        })
      }
    },
    complete: function (res) {
      loadending(that);
    }
  })
}
//网页加载中请求开始
function loadstart(that) {
  that.setData({
    loadFlag: false
  })
}
//请求结束
function loadending(that) {
  that.setData({
    loadFlag: true
  })
}
//toast开始
function loadstart1(that) {
  that.setData({
    loadFlag1: false
  })
}
//toast请求结束
function loadending1(that) {
  that.setData({
    loadFlag1: true
  })
}

function imgLook(e) { //预览图片
  var src = e.currentTarget.dataset.src;
  var lists = e.currentTarget.dataset.list;
  console.log(src);
  wx.previewImage({
    current: src, // 当前显示图片的http链接
    urls: lists // 需要预览的图片http链接列表
  })
}

function callTel(e) { //打电话
  wx.makePhoneCall({
    phoneNumber: e.currentTarget.dataset.replyPhone,
    success: function () {
      console.log("成功拨打电话");
    },
  })
}
//距离计算
function gationJudge(lat1, lng1, lat2, lng2) {
  // var that = this;
  // var lat1 = that.data.latitude //这里第一个地点的纬度
  // var lng1 = that.data.longitude //这里第一个地点的经度度
  // var lat2 = ss[0] //这里第二个地点的纬度
  // var lng2 = ss[1] //这里第二个地点的经度
  var radLat1 = lat1 * Math.PI / 180.0;
  var radLat2 = lat2 * Math.PI / 180.0;
  var a = radLat1 - radLat2;
  var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137; //地球半径
  s = Math.round(s * 10000) / 10000;
  var s = s.toFixed(2) //得出距离
  console.log(s);
  return s;
}
//授权头像请求;
function imgurl(that) {
  wx.request({
    url: app.globalData.urls + 'Shop/MiniIndex/get_config',
    method: 'POST',
    data: {
      head: 1
    },
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      // console.log(res.data.data.headimg); 
      console.log(res.data)
      that.setData({
        powerimgurl: res.data.data.X_HEAD,
      })
    },
  })
}

//获取thirdid
function bindGetUserInfo(e, that, callback) {
  var code = app.globalData.code;
  var iv = e.detail.iv;
  var encryptedData = e.detail.encryptedData;
  var userInfo = e.detail.userInfo;
  // var data1 = JSON.stringify({
  //   code: code,
  //   iv: iv,
  //   encryptedData: encryptedData
  // });
  app.globalData.userInfo = userInfo;
  if (code) {
    if (userInfo) {
      wx.showLoading({
        title: '授权中~~~',
      })
      wx.request({
        url: app.globalData.urls + '/Api/Wechatapp/codestorage',
        // url: app.globalData.urls + 'Shop/MiniIndex/virtualThird',
        method: 'POST',
        data: {
          code: code,
          iv: iv,
          encryptedData: encryptedData
        },
        header: {
          "Content-Type": "application/x-www-data-urlencoded"
        },
        success: function (res) {
          var res = res.data;
          wx.hideLoading()
          console.log(res);
          if (res.ret == '0') {
            var thirdsesid = res.thirdsesid;
            //获取用户信息;
            wx.getUserInfo({
              success: function (res) {
                // console.log(res)
                app.globalData.userinfo_more = JSON.parse(res.rawData);
              }
            })

            try {
              wx.setStorageSync('thirdsesid', thirdsesid);
              app.globalData.thirdsesid = thirdsesid;
              //返回上一页
              // console.log('地址' + getPage());
              // console.log( getoptions());
              // var geturls = getPage();
              // if (geturls == 'pages/index/index' || geturls == 'pages/store/store' || geturls == 'pages/user/user') {
              //   wx.switchTab({
              //     url: '/' + getPage(),
              //   })
              // } else {
              //   var id = wx.getStorageSync('id');
              //   console.log('/' + getPage() + '?id=' + id);
              //   wx.navigateTo({
              //     url: '/' + getPage() + '?id=' + id,
              //   })
              // }
              that.setData({
                powerflag : true,   //设置授权页面的显示状态;
              })
              that.onLoad();
              that.onShow();  //授权成功重新加载页面;
              callback(res);
            } catch (e) {}
          } else if (res.ret == 102) {
            // wx.navigateTo({
            //   url: "pages/accredit/accredit",
            // })
            that.setData({
              powerflag : false, 
            })
          }
        },
        fail: function (res) {
          console.log(res);
        }
      })
    } else {
      wx.showToast({
        title: '请先授权',
        image: '/pages/image/error.png',
        icon: 'none',
        duration: 2000
      })
    }

  } else {
    wx.showToast({
      title: '请先登录获取code',
      image: '/pages/image/error.png',
      icon: 'none',
      duration: 2000
    })
  }


}
//缓存
function getThirdsesid() {
  try {
    var value = wx.getStorageSync('thirdsesid');
    if (value) {
      return value;
    }
  } catch (e) {
    return false;
  }
}
//获取当前页面
function getPage() {
  var pages = getCurrentPages() //获取加载的页面
  // var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var prevPage = pages[pages.length - 2]; //上一个页面
  var url = prevPage.route //当前页面url
  // var options = prevPage.options //如果要获取url中所带的参数可以查看options
  return url;
}
//获取带的参数值
function getoptions() {
  var pages = getCurrentPages() //获取加载的页面
  var prevPage = pages[pages.length - 2]; //上一个页面
  var options = prevPage.options //如果要获取url中所带的参数可以查看options
  return options;
}
module.exports = {
  bindGetUserInfo: bindGetUserInfo,
  getThirdsesid: getThirdsesid,
  getPage: getPage,
  getoptions: getoptions,
  index: index,
  indexMore: indexMore,
  goodsdetails: goodsdetails,
  comment: comment,
  commentmore: commentmore,
  conforder: conforder,
  loadcoupon: loadcoupon,
  orderdone: orderdone,
  sellmsg: sellmsg,
  loadstart: loadstart,
  loadending: loadending,
  loadstart1: loadstart1,
  loadending1: loadending1,
  imgLook: imgLook,
  callTel: callTel,
  gationJudge: gationJudge,
  isLogin: isLogin,
  myorder: myorder,
  orderLoadmore: orderLoadmore,
  store: store,
  storetMore: storetMore,
  imgurl: imgurl,   //授权头像请求;
}
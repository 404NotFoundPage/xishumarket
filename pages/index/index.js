//index.js
var touchDot = 0; //触摸时的原点
var time = 0; // 时间记录，用于滑动时且时间小于1s则执行左右滑动
var interval = ""; // 记录/清理时间记录
var flag = true; //请求开关
var dh;
var api = require('../../utils/pub.js');
var app = getApp();

Page({
  data: {
    src: "../images/my_bg.png",
    height: '',
    height1: '', //可用的高度
    condition: false,
    loadFlag: true,
    loadFlag1: true,
    down: false,
    picArr: '',
    p: 1,
    animation: {},
    // 回到顶部;
    back_top_opacity: 0,
    back_top_zIndex: -999,
    powerflag: true,   //授权模板;
    powerimgurl:"",//授权头像;
    noinfoflag: true, //
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


  onLoad: function (options) {
    var that = this;
    // 判断是否授权  
    // wx.clearStorage();
    var thirdsesid = api.getThirdsesid();

    if (thirdsesid != '' && thirdsesid != undefined) {
      if ( that.data.p == 1) {
        console.log(that.data.p)
        //获取用户信息;
        wx.getUserInfo({
          success: function (res) {
            // console.log(res)
            app.globalData.userinfo_more = JSON.parse(res.rawData);
          }
        })
        var p = that.data.p;
        var data = {
          p: p,
          thirdsesid: thirdsesid
        }
        api.index(that, p, data, callback);

        function callback(res) {
          if (res.ret == '0') {
            if (res.data.length != 0) {
              that.setData({
                picArr: res.data,
                p: that.data.p += 1,
                down: false
              });
            } else {
              wx.showToast({
                title: '暂无数据',
                // image: '../image/error.png',
                icon: 'none',
                duration: 2000
              })
              that.setData({
                down: true
              })
            }
          } else {
            api.imgurl(that);
            that.setData({
              powerflag : false,
            })
          }
        }

        // wx.clearStorage();
        wx.getStorage({
          key: 'userStatus',
          success: function (res) {
            console.log(res);
            // console.log('ceshi' + res.data);
            if (res.data == '1') { //lao
              that.setData({
                condition: true,
                animation: {}
              });
              // wx.clearStorage(); 
              clearInterval(dh);
            }
          },
          fail: function (res) {
            console.log(res);
            that.setData({
              condition: false
            });
            //设置动画
            that.animation = wx.createAnimation({
              timingFunction: "linear",
              duration: 1500
            });
            dh = setInterval(function () {
              // console.log('donghua');
              that.animation.translate(0, -40).step().translate(0, 40).step();

              that.setData({
                animation: that.animation.export()
              });
            }, 1000)

          }
        });
      }
    } else {
      api.imgurl(that);
      that.setData({
        powerflag : false,
      })
      // wx.navigateTo({
      //   url: '../accredit/accredit',
      // })

    }

    //获取屏幕高度  
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight - 122,
          height1: res.windowHeight
        })
      }
    })

  },
  start() {
    this.setData({
      condition: true
    });
  },

  // 触摸开始事件
  touchStart: function (e) {
    touchDot = e.touches[0].pageY; // 获取触摸时的原点
    // 使用js计时器记录时间
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  // 触摸移动事件
  touchMove: function (e) {
    var touchMove = e.touches[0].pageY;
    var that = this;
    // console.log("touchMove:" + touchMove + " touchDot:" + touchDot + " diff:" + (touchMove - touchDot));
    // 向上滑动
    if (touchMove - touchDot <= -20 && time < 10) {
      that.setData({
        condition: true
      });
      wx.setStorage({
        key: 'userStatus',
        data: '1'
      })
      clearInterval(dh);
    }

  },
  // 触摸结束事件
  touchEnd: function (e) {
    clearInterval(interval); // 清除setInterval
    time = 0;

  },
  lookSell: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../goodDetails/goodDetails?id=' + id,
    })
  },
  onPullDownRefresh: function () { //下拉刷新
    var that = this;
    flag = true;
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    that.setData({
      p: 1
    });
    var p = that.data.p;
    var thirdsesid = api.getThirdsesid();
    var data = {
      p: p,
      thirdsesid: thirdsesid
    }
    api.index(that, p, data, callback);

    function callback(res) {
      if (res.ret == '0') {
        if (res.data.length != 0) {
          that.setData({
            picArr: res.data,
            p: that.data.p += 1,
            down: false
          });
        } else {
          wx.showToast({
            title: '暂无数据',
            // image: '../image/error.png',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            down: true
          })
        }
      }
    }
  },

  onReachBottom: function () {
    var that = this;
    var p = that.data.p;
    var thirdsesid = api.getThirdsesid();
    var data = {
      p: p,
      thirdsesid: thirdsesid
    }
    api.indexMore(that, p, data, flag, callback);

    function callback(res) {
      var maxPage = res.maxPage;
      if (res.ret == '0') {
        if (res.data.length != 0) {
          that.setData({
            picArr: that.data.picArr.concat(res.data),
            p: that.data.p += 1
          });
        } else {
          that.setData({
            // picArr: that.data.picArr,
            // p: maxPage,
            down: true,
            noinfoflag: false,  //显示没有更多数据;
          });
          flag = false;
        }
      } else {
        that.setData({
          noinfoflag: false,  //显示没有更多数据;
        })
        flag = true;
      }
    }

  },
  onShow: function () {
    let that = this;
    wx.showShareMenu({
      withShareTicket: true
    })

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
          if( that.data.p == 1 ){  //若果授权成功并且index数据加载过一次就不onload;
            that.onLoad();
          }
        }
        return;
      },
      fail: function () {
        console.log("session_key已经失效，需要重新执行登录流程")
        // session_key 已经失效，需要重新执行登录流程
        app.onLaunch()
        api.imgurl(that);
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
    /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    wx.showShareMenu({
      withShareTicket: true,
      success: function (res) {
        console.log('分享成功');
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
        console.log("分享失败")
      }
    })
    return {
      title: " ",
      path: '/pages/index/index',
      // imageUrl: that.data.datas.pic_carous[0],
      
    }
  }

})
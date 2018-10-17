// pages/my/my.js
var api = require('../../utils/pub.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    condition: true,
    loadFlag: true,
    username: "", //用户名;
    userimg: "", //用户头像;
    datas: '',
    height: '',
    phonenum: "", //电话号码;
    isshare: '', //状态;

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


  call: function (e) { //电话
    api.callTel(e);
  },
  href_er: function () {
    wx.navigateTo({
      url: '../coupon/coupon'
    })
  },
  href_num: function () {
    wx.navigateTo({
      url: '../codeSet/codeSet'
    })
  },
  href_all: function () {

    wx.navigateTo({
      url: '../myOrder/myOrder?index=0'
    })

  },
  //跳转订单 
  jumpOrder: function (e) {
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../myOrder/myOrder?index=' + index,
    })

  },
  bindGetUserInfo: function (e) {
    // console.log(e.detail);
    wx.getUserInfo({
      success: function (res) {
        console.log(res)
      }
    })
  },
  //vip页面跳转
  href_vip() {
    wx.navigateTo({
      url: "../vip/vip"
    })
  },
  //商家pwd页面跳转;
  href_pwd() {
    wx.navigateTo({
      url: "../pwd/pwd",
    })
  },
  //收益中心跳转;
  jump_myshop() {
    wx.navigateTo({
      url: '../myshops/myshops'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  onShow: function () {
    var that = this;
    this.setData({
      userimg: app.globalData.userInfo.avatarUrl,
      username: app.globalData.userInfo.nickName,
    })
    // 判断是否授权  
    // wx.clearStorage();
    var thirdsesid = api.getThirdsesid();
    if (thirdsesid != '' && thirdsesid != undefined) {
      var data = {
        thirdsesid: thirdsesid,
      }
      api.isLogin(that, data);
    } else {
      // wx.navigateTo({
      //   url: '../accredit/accredit',
      // })
      app.onLaunch(); //获取code;
      api.imgurl(that)
      that.setData({
        powerflag: false,
      })
      return false;
    }
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        })
      }
    })

    //下面是很可能会出问题的地方;
    wx.checkSession({
      success: function () {
        //session_key 未过期，并且在本生命周期一直有效
        if (!api.getThirdsesid()) {
          console.log("session_key 未过期并且getThirdsesid不存在")
          app.onLaunch()
          api.imgurl(that)
          //  wx.navigateTo({
          //    url:"../accredit/accredit"
          //  })
          that.setData({
            powerflag: false,
          })
        } else {
          console.log("session_key 未过期并且getThirdsesid存在")
          that.setData({
            powerflag: true,
          })
          // that.onLoad();
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

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
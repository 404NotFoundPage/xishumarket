var api = require('../../utils/pub.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number: "", //手机号;
    username: "未绑定", //昵称
    loginapp: "", //

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


  href_phone: function () {
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    var url = currentPage.route //当前页面url
    wx.navigateTo({
      url: '../webview/webview?originurl=' + url,
    })
  },
  //绑定app
  bind_app() {
    var that = this;
    var thirdsesid = api.getThirdsesid();
    wx.showModal({
      title: "提示",
      content: "您正在绑定西蜀网app账户名 " + that.data.username + " 是否确认?",
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.urls + 'Shop/MiniIndex/asite',
            method: 'POST',
            data: {
              thirdsesid: thirdsesid,
              action: 1
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              console.log(res)
              if (res.data.ret == 0) {
                that.setData({
                  username: res.data.username,
                  loginapp: 1,
                })
              }
            }
          });
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 判断是否授权  
    // wx.clearStorage();
    var thirdsesid = api.getThirdsesid();
    if (thirdsesid != '' && thirdsesid != undefined) {
      wx.request({
        url: app.globalData.urls + 'Shop/MiniIndex/asite',
        method: 'POST',
        data: {
          thirdsesid: thirdsesid
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if (res.data.ret == 0) {
            that.setData({
              number: res.data.phone,
              username: res.data.username,
              loginapp: res.data.loginapp,
            })
          } else if (res.data.ret == 1) {
            wx.showToast({
              title: res.data.msg,
              duration: 2000,
            })
          } else if (res.data.ret == 102) {
            app.onLaunch(); //获取code;
            api.imgurl(that)
            that.setData({
              powerflag: false,
            })
            return false;
          } else if (res.data.ret == 103) {
            var pages = getCurrentPages() //获取加载的页面
            var currentPage = pages[pages.length - 1] //获取当前页面的对象
            var url = currentPage.route //当前页面url
            console.log(url);
            wx.navigateTo({
              url: '../webview/webview?originurl=' + url,
            })
          }
        }
      })
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onShow: function () {

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
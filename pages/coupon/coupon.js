// pages/coupon/coupon.js
var api = require('../../utils/pub.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datacard: '',
    loadFlag: true,
    loadFlag1: true,

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

  /**
   * 生命周期函数--监听页面加载
   */ 
  onLoad: function(options) {
    var that = this;
    // 判断是否授权  
    // wx.clearStorage();
    var thirdsesid = api.getThirdsesid();
    if (thirdsesid != '' && thirdsesid != undefined) {
      var data = {
        thirdsesid: thirdsesid
      }
      api.loadstart(that);
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
          if (res.ret == '0') {
            if (res.data.length != 0) {
              that.setData({
                datacard: res.data
              });
            } else {
              wx.showToast({
                title: '暂无数据',
                // image: '../image/error.png',
                icon: 'none',
                duration: 2000
              })
            }
          }else if( res.ret == '103' ){
            var pages = getCurrentPages()    //获取加载的页面
            var currentPage = pages[pages.length-1]    //获取当前页面的对象
            var url = currentPage.route    //当前页面url
            console.log(url);
            wx.navigateTo({
              url: '../webview/webview?originurl=' + url,
            })
          } else {
            wx.showToast({
              title: res.msg,
              // image: '../image/error.png',
              icon: 'none',
              duration: 2000
            })


          }
        },
        complete: function (res) {
          api.loadending(that);
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
  use: function() {
    wx.switchTab({
      url: '../index/index',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  onShow: function () {
    
  },
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
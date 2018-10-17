// pages/moneydetails/moneydetails.js
let app = getApp();
var api = require('../../utils/pub.js');  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas:"",  //页面数据;
    p: 1,    //初始页面;
    flag: true,  //下拉状态;
    maxpage: '',  //总页数

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
  onLoad: function (options) {
    var thirdsesid = api.getThirdsesid();
    // console.log(thirdsesid)
    let that = this;
    if( thirdsesid !="" && thirdsesid != undefined){
      wx.request({
        url: app.globalData.urls + 'Shop/MiniShare/money_details',
        method: 'POST',
        data: {
          thirdsesid: thirdsesid,
          p: 1,
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log(res.data);
          if( res.data.ret == 0 ){
            that.setData({
              datas: res.data.data,
              maxpage: res.data.maxPage,
              p: that.data.p+=1,
            })
          }else{
              that.setData({
                flag: false,
              })
            wx.showToast({
              title: '没有更多数据了',
              icon:"none",
              // image:  "../image/error.png",
              duration: 2000
            })
          }
        }
      })
    }else{
      // wx.navigateTo({
      //   url: '../accredit/accredit',
      // })
      app.onLaunch(); //获取code;
      api.imgurl(that)
      that.setData({
        powerflag: false,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    //下面是很可能会出问题的地方;
    wx.checkSession({
      success: function () {
        //session_key 未过期，并且在本生命周期一直有效
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

  /**
   * 生命周期函数--监听页面隐藏
   */
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
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    var thirdsesid = api.getThirdsesid();
    // console.log(thirdsesid)
    let that = this;
    if( thirdsesid !="" && thirdsesid != undefined){
      that.setData({
        p: 1,
        flag: true,
      })
      wx.request({
        url: app.globalData.urls + 'Shop/MiniShare/money_details',
        method: 'POST',
        data: {
          thirdsesid: thirdsesid,
          p: that.data.p,
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log(res.data);
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
          if( res.data.ret == 0 ){
            that.setData({
              datas: res.data.data,
              p: that.data.p+=1,
            })
          }
        }
      })
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      var thirdsesid = api.getThirdsesid();
      // console.log(thirdsesid)
      let that = this;
      if( this.data.flag ){
        if( thirdsesid !="" && thirdsesid != undefined){
          if( that.data.p <= that.data.maxpage ){
            wx.request({
              url: app.globalData.urls + 'Shop/MiniShare/money_details',
              method: 'POST',
              data: {
                thirdsesid: thirdsesid,
                p: that.data.p,
              },
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              success: function (res) {
                console.log(res.data);
                if( res.data.ret == 0 ){
                  if( res.data.data.length>0 ){
                    that.setData({
                      datas: that.data.datas.concat(res.data.data),
                      p: that.data.p+=1,
                    })
                  }
                }
              }
            })
          }else{
            that.setData({
              flag: false,
            })
          }
        }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
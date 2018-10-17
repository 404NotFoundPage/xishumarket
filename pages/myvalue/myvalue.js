// pages/myvalue/myvalue.js
let app = getApp();
var api = require('../../utils/pub.js');  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:"0",

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
        url: app.globalData.urls + 'Shop/MiniShare/my_money',
        method: 'POST',
        data: {
          thirdsesid: thirdsesid,
          p: 1,
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log(res.data.ret);
          if( res.data.ret == 0 ){
            that.setData({
              money: res.data.money,
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

  jump_details(){
    wx.navigateTo({
      url: '../moneydetails/moneydetails',
    })
  },
  jump_sort(){
    wx.navigateTo({
      url: '../moneysort/moneysort',
    })
  },
//提现;
  carsh(){
    wx.navigateTo({
      url: '../cash/cash'
    })
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
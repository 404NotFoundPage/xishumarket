// pages/vip/vip.js
let app = getApp();
var api = require('../../utils/pub.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shoplist: [],
    userimg:"",
    username:"",
    vip_pri:"",   //会员价格;
    bg_pic:"",//背景;
    vip_num:"",  //会员数量;
    isVip:"",

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


  //取消支付;
  cancelpay:function(data){
    console.log("取消支付"+ data)
    wx.request({
      url: app.globalData.urls+"/Optbuy/Orders/cancel_order",
      method: "POST",
      data: data,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success:function(r){
        console.log(r)
      }
    })
  },
  //开通会员
  open_vip(){
    var that = this;
    var thirdsesid = api.getThirdsesid();
    if( thirdsesid != '' && thirdsesid != undefined ){
      wx.request({
        url: app.globalData.urls+"/Vip/Wechatapp/wechatAppOpen",
        method: "POST",
        data: { thirdsesid: thirdsesid },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success:function(resq){
          console.log(resq.data);
          if( resq.data.ret == 1){  //支付失败;
            wx.showToast({
              title:resq.data.msg,
              image: "/pages/image/error.png",
              icon: 'none',
              duration: 2000
            })
            that.cancelpay(resq.data.resum)
          }else{   
            let mydata = JSON.parse(resq.data.data);
            // console.log( mydata )
            wx.requestPayment({
              'timeStamp': mydata.timeStamp,
              'nonceStr': mydata.nonceStr,
              'package': mydata.package,
              'signType': mydata.signType,
              'paySign': mydata.paySign,
              'success': function(res) {
                if( res.errMsg == 'requestPayment:ok' ){
                  console.log("支付成功")
                  //成功时
                  wx.showToast({
                    title:resq.data.msg,
                    icon: 'success',
                    duration: 2000
                  })
                    setTimeout(function () {
                      wx.switchTab({
                        url: "../vip/vip"
                      })
                    }, 2000);
                }
              },
              'fail': function(res) {
                console.log("支付失败")
                wx.showToast({
                  title:resq.data.msg,
                  image: "/pages/image/error.png",
                  icon: 'none',
                  duration: 2000
                })
                that.cancelpay(resq.data.resum)
              }
            })
          }
        }
      })
    }

  },
  //商品跳转;
  go_goodsdetail(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../goodDetails/goodDetails?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thirdsesid = api.getThirdsesid();
      console.log(app.globalData);
        // console.log(thirdsesid)
        let that = this;
        if( thirdsesid !="" && thirdsesid != undefined){
          wx.request({
            url: app.globalData.urls + 'Shop/MiniIndex/vipGoods',
            method: 'POST',
            data: {thirdsesid: thirdsesid},
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (resq) {
              console.log(resq);
              var resq = resq.data;
              if (resq.ret == '0') {
                that.setData({
                  shoplist: resq.data,
                  userimg: app.globalData.userinfo_more.avatarUrl,
                  username:app.globalData.userinfo_more.nickName,
                  vip_pri: resq.money,
                  bg_pic: resq.pic,
                  vip_num: resq.msg,
                  isVip: resq.isvip,
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
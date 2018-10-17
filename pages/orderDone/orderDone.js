// pages/orderDone/orderDone.js
var api = require('../../utils/pub.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas: '',
    isVip: '',
    price: '',
    number: 1,
    loadFlag: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = wx.getStorageSync('id');
    var that = this;
    console.log(id);
    wx.getStorage({
      key: 'number',
      success: function (res) {
        that.setData({
          number: res.data
        })
      },
    })
    // 判断是否授权  
    // wx.clearStorage();
    var thirdsesid = api.getThirdsesid();
    if (thirdsesid != '' && thirdsesid != undefined) {
      var id = wx.getStorageSync('id');
      var data = {
        id: id,
        thirdsesid: thirdsesid
      }
      api.orderdone(that, data, callback);
      function callback(res){
        if (res.ret == '0') {
          that.setData({
            datas: res.data,
            isVip: res.isVip
          });
          if (res.isVip == '0') {
            that.setData({
              price: res.data.price,
            });
          } else if (res.isVip == '1') {
            that.setData({
              price: res.data.price_vip,
            });
          }
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
      wx.navigateTo({
        url: '../accredit/accredit',
      })

    }
    

    
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

  },
  youxuan: function() {
    wx.switchTab({
      url: '../index/index'
    })
  },
  call: function(e) { //电话
    api.callTel(e);
  }
})
var api = require('../../utils/pub.js');
var app = getApp();
var flag = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    h1: 0,
    val: '获取验证码',
    condition: false,
    tel: '138****7005',
    code: '2047',
    picode: 'PENG'
  },
  yan: function(e) {
    var that = this;
    that.setData({
      val: 10
    });
    var i = 10; // 倒计时时间
    if (flag) {
      time(i);
    }

    function time(i) {
      if (i == 0) {
        that.setData({
          val: '获取验证码',
          condition: false
        });
        flag = true;
      } else {
        flag = false;
        i--;
        that.setData({
          val: i + 'S重新获取',
          condition: true
        });
        setTimeout(function() {
          time(i);
        }, 1000);
      }
    }
  },
  sub: function() {
    var that = this;
    var tel = that.data.tel;
    var code = that.data.code;
    var picode = that.data.picode;
    var data = {
      tel: tel,
      picode: picode,
      code: code
    };
    console.log(data);

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
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            h1: res.windowHeight
          })
          console.log(res.windowHeight);
        }
      })
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

  }
})
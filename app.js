//app.js
var app = getApp();
var urlss = 'https://shop.xishuw.com/';
// var api = require('../../utils/pub.js');
App({
  globalData: {
    urls: 'https://shop.xishuw.com/',
    userInfo: '',
    thirdsesid: '',
    code: '',
    id: '',//分享商品的id
    configer:{},  //配置信息;
    userinfo_more:{},   //登录用户的基本信息;
    options_scene:{query:{}},   //app的进入场景数据;

    optionsGoodtails:""  //详情页面options存;
  },
  onShow: function (options) {
    console.log(options)
    console.log('获取转发信息');
    console.log(decodeURIComponent(options.query.scene))
    if( options.query.scene ){
      let newoptions = decodeURIComponent(options.query.scene);
      let _options = newoptions.split('&');
      let _key = {};
      _options.forEach(function(item,idx){
        _key[item.split('=')[0]] = item.split('=')[1];
      })
      this.globalData.options_scene.query = _key;
      this.globalData.options_scene.scene = options.scene
    }
    else{
      this.globalData.options_scene = options;
    }
  },
  onLaunch: function (options) {
    console.log("执行！！")
    var that = this;
    // //测试用
    // try {
    //   wx.removeStorageSync('thirdsesid');
    // } catch (e){
    // }
    wx.checkSession({
      success: function(){
        console.log("未过期")
        //session_key 未过期，并且在本生命周期一直有效
        wx.getUserInfo({
          success:function(res){
            that.globalData.userInfo = res.userInfo;
            if ( !wx.getStorageSync('thirdsesid') ){
              that.Loagin();
            }
          }
        })
      },
      fail: function(){
        console.log("已过期")
        // session_key 已经失效，需要重新执行登录流程
        that.Loagin()

      }
    })
    
  },
  Loagin:function(){
    console.log(111)
    let that = this;
    wx.login({
      success: function (res) {   
        that.globalData.code = res.code;
        console.log(res);
        try {
          var value = wx.getStorageSync('thirdsesid');
          // console.log(value);
          if (value != '' && value != undefined) {
              return value;
          }
        } catch (e) {
        }
      }
    });
  },
  onUnload: function () {
    //
    try {
      wx.removeStorageSync("openGid")
      wx.removeStorageSync("shareId")
      wx.removeStorageSync("fu")
    } catch (e) {
      // console.log(e);
      // Do something when catch error
    }
  }


})
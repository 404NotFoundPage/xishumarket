// pages/pwd/pwd.js
var api = require('../../utils/pub.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: "", //页面提示内容;
    flag: false,
    pass: "",
    openGid: "",
    sharepic: "", //分享的图片;

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
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //获取用户输入的密码;
  userNameInput: function (e) {
    this.setData({
      pass: e.detail.value
    })
  },
  confirm() {
    var thirdsesid = api.getThirdsesid();
    let that = this;
    if (this.data.pass != "" || this.data.pass != undefined) {
      wx.request({
        url: app.globalData.urls + 'Shop/MiniIndex/bindGroup',
        method: 'POST',
        data: {
          thirdsesid: thirdsesid,
          password: that.data.pass,
          openGid: that.data.openGid,
          headimg: app.globalData.userInfo.avatarUrl,
          nickname: app.globalData.userInfo.nickName,
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if (res.data.ret == 102) {
            app.onLaunch(); //获取code;
            api.imgurl(that)
            that.setData({
              powerflag: false,
            })
            return false;
          } else if (res.data.ret == 0) {
            wx.showToast({
              title: res.data.msg,
              icon: "none",
              duration: 2000
            })
            setTimeout(function(){
              wx.switchTab({
                url:'../index/index'
              })
            },2000)
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: "none",
              // image: "../image/error.png",
              duration: 2000
            })
            setTimeout(function(){
              wx.switchTab({
                url:'../index/index'
              })
            },2000)
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    // 判断是否授权  
    // wx.clearStorage();
    var thirdsesid = api.getThirdsesid();
    if (thirdsesid != '' && thirdsesid != undefined) {
      wx.getUserInfo({
        success: function (res) {
          // console.log(res) 
          app.globalData.userInfo = JSON.parse(res.rawData);
        }
      })
      var data = {
        thirdsesid: thirdsesid
      }
    } else {
      // var pages = getCurrentPages() //获取加载的页面
      // var currentPage = pages[pages.length - 1] //获取当前页面的对象
      // var url = currentPage.route //当前页面url
      // wx.navigateTo({
      //   url: '../accredit/accredit?url=' + url,
      // })
      app.onLaunch(); //获取code;
      api.imgurl(that)
      that.setData({
        powerflag: false,
      })
      return false;
    }
    /*******************************************************************/
    wx.showShareMenu({
      withShareTicket: true,
    })
    if (app.globalData.options_scene.scene == '1044') {
      wx.getShareInfo({
        shareTicket: app.globalData.options_scene.shareTicket,
        complete: function (res) {
          console.log(res);
          var encryptedData = res.encryptedData;
          var iv = res.iv;
          var thirdsesid = wx.getStorageSync('thirdsesid');
          wx.request({
            url: app.globalData.urls + 'Shop/MiniIndex/shareSuccess',
            method: 'POST',
            data: {
              encryptedData: encryptedData,
              iv: iv,
              thirdsesid: thirdsesid
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              var res = res.data;
              console.log('分享的响应');
              console.log(res);
              if (res.ret == '0') {
                // var data = JSON.parse(res.data);
                // console.log('分享的data'+data);
                var openGid = res.openGid;
                that.setData({
                  openGid: openGid,
                })
                console.log('分享的openGid' + "----------" + res.openGid);
                wx.request({
                  url: app.globalData.urls + 'Shop/MiniIndex/checkBind',
                  method: 'POST',
                  data: {
                    openGid: openGid,
                    thirdsesid: thirdsesid,
                    share: 1,
                  },
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  success: function (res) {
                    console.log(res);
                    if (res.data.ret == 1) {
                      that.setData({
                        msg: res.data.msg,
                        flag: true,
                        sharepic: res.data.sharepic,
                      })
                      app.globalData.options_scene.scene = ""; //请求成功之后清除scene场景值;
                      setTimeout(function(){
                        wx.switchTab({
                          url:'../index/index'
                        })
                      },1500)
                    } else {
                      that.setData({
                        sharepic: res.data.sharepic,
                      })
                    }
                  }
                })
                // try {
                //   wx.setStorageSync('openGid', openGid);
                // } catch (e) {}
              }else if( res.ret == 1){
                try {
                  wx.removeStorageSync("openGid")
                  wx.removeStorageSync("shareId")
                } catch (e) {
                  // console.log(e);
                  // Do something when catch error
                }
              }
            }
          })
        }
      })
    } else {
      console.log("正常进入")
      var thirdsesid = wx.getStorageSync('thirdsesid');
      wx.request({
        url: app.globalData.urls + 'Shop/MiniIndex/checkBind',
        method: 'POST',
        data: {
          thirdsesid: thirdsesid
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if (res.data.ret == 0 || res.data.ret == 1) {
            console.log(res);
            that.setData({
              // msg: res.data.msg,
              // flag: true,
              sharepic: res.data.sharepic,
            })
          } else if (res.data.ret == 102) {
            app.onLaunch(); //获取code;
            api.imgurl(that)
            that.setData({
              powerflag: false,
            })
            return false;
          }
        }
      })
      
    }
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
      title: '',
      path: '/pages/pwd/pwd',
      // imageUrl: that.data.datas.pic_carous[0],
      imageUrl: that.data.sharepic,
    }
  }
})
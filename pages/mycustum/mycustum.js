// pages/mycustum/mycustum.js
let app = getApp();
var api = require('../../utils/pub.js');  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas: "",//页面的数据;

    p: 1,  //默认第一页;
    maxpage: '',  //总页数
    powerflag: true,   //授权模板;

    powerimgurl:"",//授权头像;
    flag: true, //上拉触底开关;
    totalmoney: '', //总共的收益;
    inviteimgurl: "",  //邀请朋友图片地址;
    inviteflag: true, //邀请海报显示;
    onOff: true,   //邀请码生成开关;
    loadFlag: true, // 初始加载;
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
    api.loadstart(this);
    var thirdsesid = api.getThirdsesid();
    let that = this;
    if( thirdsesid !="" && thirdsesid != undefined){
      wx.request({
        url: app.globalData.urls + '/Shop/MiniShare/customer',
        method: 'POST',
        data: {
          thirdsesid: thirdsesid,
          p: 1,
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          api.loadending(that);  //结束加载动画;
          console.log(res.data);
          if( res.data.ret == 0 ){
            that.setData({
              datas: res.data.data,
              totalmoney: res.data.getsec,
              maxpage: res.data.maxPage,
              p: ++that.data.p,
            })
            if( res.data.data.length == 0 ){
              that.setData({
                flag: false,
              })
            }
          }else if( res.data.ret == 103){
            var pages = getCurrentPages() //获取加载的页面
            var currentPage = pages[pages.length - 1] //获取当前页面的对象
            var url = currentPage.route //当前页面url
            console.log(url);
            wx.navigateTo({
              url: '../webview/webview?originurl=' + url + '&id=' + id+'&login=1&fu=' + app.globalData.options_scene.query.fu || 0,
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

  // 邀请朋友;
  invitefriends(){
    if( this.data.onOff ){
      let that = this;
      wx.showLoading({
        title:'正在生成海报~~',
        success:function(){
          that.setData({
            onOff: false,
          })
        }
      })
      var thirdsesid = api.getThirdsesid();
      if( thirdsesid !="" && thirdsesid != undefined ){
        wx.request({
          url: app.globalData.urls + '/Shop/Poster/customerPic',
          method: 'POST',
          data: {
            thirdsesid: thirdsesid,
            nickname: app.globalData.userInfo.nickName,
            headimg: app.globalData.userInfo.avatarUrl,
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            console.log(res.data);
            wx.hideLoading()
            if( res.data.ret == 0 ){
              that.setData({
                inviteimgurl: res.data.url,
                inviteflag: false,
                onOff: true,
              })
            }
          }
        })
      }
    }
  },
  //cancel
  cancel(){
    this.setData({
      inviteflag: true,
    })
  },
  //取消滑动蒙层移动;
  _cancelmove(){
    return false;
  },
  //长按保存图片;
    longtapsaveImg() {
      let that = this;
      wx.downloadFile({
        url: that.data.inviteimgurl, //先将图片下载下来;
        success: function (res) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function (resq) {
              console.log(resq)
              wx.showToast({
                title: "保存成功",
                icon: "success",
                duration: 2000,
              })
            },
            fail: function (err) {
              console.log(err)
              if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                console.log("用户一开始拒绝了，我们想再次发起授权")
                console.log('打开设置窗口')
                wx.openSetting({
                  success(settingdata) {
                    console.log(settingdata)
                    if (settingdata.authSetting['scope.writePhotosAlbum']) {
                      console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                    } else {
                      console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                    }
                  }
                })
              }
            }
          })
        }
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
        url: app.globalData.urls + '/Shop/MiniShare/customer',
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
              totalmoney: res.data.getsec,
              maxpage: res.data.maxPage,
              p: ++that.data.p,
            })
            if( res.data.data.length == 0 ){
              that.setData({
                flag: false,
              })
            }
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
            url: app.globalData.urls + '/Shop/MiniShare/customer',
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
                    p: ++that.data.p,
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
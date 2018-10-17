// pages/myshps/myshops.js
let app = getApp();
var api = require('../../utils/pub.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas: "", //页面数据;
    p: 1, //分页;
    flag: true,
    maxpage: "", //页面总页数

    powerflag: true,   //授权模板;
    powerimgurl:"",//授权头像;
    userid: '',   //用户标识身份;
    minidata:"",  //收益数据;
    loadFlag: true, 
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
_cancelmove(){
  return false;
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.options_scene)
    console.log('123')
    api.loadstart(this);
    var thirdsesid = api.getThirdsesid();
    let that = this;
    if (thirdsesid != "" && thirdsesid != undefined) {
      wx.request({
        url: app.globalData.urls + 'Shop/MiniShare/shareGoods',
        method: 'POST',
        data: {
          thirdsesid: thirdsesid,
          p: 1,
          fu: app.globalData.options_scene.query.fu || null ,
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          api.loadending(that);
          console.log(res.data.ret);
          if (res.data.ret == 0) {
            that.setData({
              datas: res.data.data,
              maxpage: res.data.maxPage,
              minidata: res.data.minidata,
              userid: res.data.minidata.v.userid,
              p: ++that.data.p, //页码加一;
            })
          }else if( res.data.ret == 103 ){
            var pages = getCurrentPages()    //获取加载的页面
            var currentPage = pages[pages.length-1]    //获取当前页面的对象
            var url = currentPage.route    //当前页面url
            wx.navigateTo({
              url: '../webview/webview?originurl=' + url + '&fu=' + app.globalData.options_scene.query.fu || 0,
            })
          }else if(res.data.ret == 1){
            that.setData({
              flag: false,
            })
          }
        }
      })
    } else {
      app.onLaunch(); //获取code;
      api.imgurl(that)
      that.setData({
        powerflag: false,
      })
      return false;
    }

  },

  moneydetails_jump(){
    wx.navigateTo({
      url: '../moneydetails/moneydetails',
    })
  },
  mycustum_jump(){
    wx.navigateTo({
      url: '../mycustum/mycustum',
    })
  },
  moneysort_jump(){
    wx.navigateTo({
      url: '../moneysort/moneysort',
    })
  },
  jump_myvalue() {
    wx.navigateTo({
      url: '../myvalue/myvalue',
    })
  },
  //提现;
  carsh(){
    wx.navigateTo({
      url: '../cash/cash'
    })
  },
  //详情页面跳转
  jump_details(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url:'../goodDetails/goodDetails?id='+e.currentTarget.dataset.id
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
    wx.showShareMenu({
      withShareTicket: true,
    })



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
    this.setData({
      p: 1,
      flag: true,
    })
    var thirdsesid = api.getThirdsesid();
    // console.log(thirdsesid)
    let that = this;
    if (thirdsesid != "" && thirdsesid != undefined) {
      wx.request({
        url: app.globalData.urls + 'Shop/MiniShare/shareGoods',
        method: 'POST',
        data: {
          thirdsesid: thirdsesid,
          p: that.data.p,
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log(res.data.ret);
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
          if (res.data.ret == 0) {
            that.setData({
              datas: res.data.data,
              p: ++that.data.p, //页码加一;
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
    console.log(this.data.p);
    if (this.data.flag) {
      var thirdsesid = api.getThirdsesid();
      // console.log(thirdsesid)
      let that = this;
      if (thirdsesid != "" && thirdsesid != undefined) {
          wx.request({
            url: app.globalData.urls + 'Shop/MiniShare/shareGoods',
            method: 'POST',
            data: {
              thirdsesid: thirdsesid,
              p: that.data.p,
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              if (res.data.ret == 0) {
                  that.setData({
                    datas: that.data.datas.concat(res.data.data),
                    p: ++that.data.p, //页码加一;
                  })
              }else if(res.data.ret == 1){
                that.setData({
                  flag: false,
                })
                wx.showToast({
                  title: res.data.msg,
                  icon: "none",
                  // image:  "../image/error.png",
                  duration: 2000
                })
              }

            }
          })
      } 
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this;
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
      title: "西蜀网优选收益中心",
      path: '/pages/myshops/myshops?fu=' + that.data.userid,
      // imageUrl: that.data.datas.pic_carous[0],
      // imageUrl: that.data.datas.list_pic_3,   //分享图片;
    }
  }
})
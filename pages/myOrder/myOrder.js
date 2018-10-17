var flag = true;
var state;
var api = require('../../utils/pub.js');
var app = getApp();
Page({
  data: {
    currentTab: 0,
    num: 0,
    winHeight: '',
    p: 1,
    id: '',
    datas: '',
    state: '',
    none: false, //无数据
    condition: true, //显示数据
    loadFlag: true,
    loadFlag1: true,
    appopenid:"",
    order_id:"",//订单id;

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


  onLoad: function(options) {
    var that = this;
    var index = options.index;
    console.log(index);
    var thirdsesid = api.getThirdsesid();
    that.setData({
      p: 1,
      state: 1
    });
    // 判断是否授权  
    // wx.clearStorage();
    var thirdsesid = api.getThirdsesid();
    if (thirdsesid != '' && thirdsesid != undefined) {
      var p = that.data.p;
      var state = 1;
      var data = {
        p: p,
        state:state,
        thirdsesid: thirdsesid
      }
      if (index == '0') {
        api.myorder(that, data,state, p, flag, callback1);
      }
      function callback1(res) {
        if (res.ret == '0') {
          if (res.data.length != 0) {
            that.setData({
              datas: res.data,
              appopenid: res.appopenid,
              condition: true,
              none: false,
              p: that.data.p += 1
            });
          } else {
            wx.showToast({
              title: '无更多数据',
              // image: '../image/error.png',
              icon: 'none',
              duration: 2000
            });
            flag = false;
          }
        }else if( res.ret == 103 ){
          var pages = getCurrentPages()    //获取加载的页面
          var currentPage = pages[pages.length-1]    //获取当前页面的对象
          var url = currentPage.route    //当前页面url
          console.log(url);
          wx.navigateTo({
            url: '../webview/webview?originurl=' + url,
          })
        }else {
          that.setData({
            condition: false,
            none: true
          });
          flag = true;

        }
      };
    } else {
      // wx.navigateTo({
      //   url: '../accredit/accredit',
      // })
      app.onLaunch(); //获取code;
      api.imgurl(that)
      that.setData({
        powerflag: false,
      })

    }
 
    //获取高度
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winHeight: (res.windowHeight) * 2
        });
      }
    });

    this.setData({
      currentTab: options.index
    });
  },
  // onPullDownRefresh: function () { //下拉刷新
  //   console.log("下拉刷新")
  //   wx.showNavigationBarLoading(); //在标题栏中显示加载

  // },
  //上拉
  onReachBottom: function() {
    var that = this;
    var p = that.data.p;
    var state = that.data.state;
    var thirdsesid = api.getThirdsesid();
    var data={
      p: p,
      state: state,
      thirdsesid: thirdsesid
    }
    api.orderLoadmore(that, data,state, p, flag, callback2);

    function callback2(res) {
      if (res.ret == '0') {
        if (res.data.length != 0) {
          that.setData({
            datas: that.data.datas.concat(res.data),
            condition: true,
            none: false,
            p: that.data.p += 1
          });
          console.log(that.data.datas);
        } else {
          wx.showToast({
            title: '无更多数据',
            // image: '../image/error.png',
            icon: 'none',
            duration: 2000
          });
          flag = false;
        }
      } else {
        that.setData({
          condition: false,
          none: true
        });
        flag = true;
      }
    }

  },
  //滑动切换
  swiperTab: function(e) {
    var that = this;
    var currentTab = e.detail.current;
    switch (currentTab) {
      case 0:
        state = 1;
        break;
      case 1:
        state = 2;
        break;
      case 2:
        state = 12;
        break;
      case 3:
        state = 11;
        break;
      case 4:
        state = 7;
        break;
      default:
        return;
    }
    var p = 1;
    flag = true;
    //置空数据
    that.setData({datas:''});
    var thirdsesid = api.getThirdsesid();
    var data = {
      p: p,
      state: state,
      thirdsesid: thirdsesid
    }
    api.myorder(that,data, state, p, flag, callback1);

    function callback1(res) {
      if (res.ret == '0') {
        if (res.data.length != 0) {
          that.setData({
            datas: res.data,
            condition: true,
            none: false,
            p: that.data.p += 1
          });
        } else {
          wx.showToast({
            title: '无更多数据',
            // image: '../image/error.png',
            icon: 'none',
            duration: 2000
          });
          flag = false;
        }
      } else {
        that.setData({
          condition: false,
          none: true
        });
        flag = true;

      }
    };
    that.setData({
      currentTab: e.detail.current,
      p: 1,
      state: state
    });
    console.log(that.data.state);
  },
  //点击切换
  clickTab: function(e) {
    var that = this;
    //置空数据
    that.setData({ datas: '' });
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        p: 1
      })
    }
  },
  findgood: function() {
    wx.switchTab({
      url: '../store/store',
    })
  },
  href_evaluate: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../evaluateGoods/evaluateGoods?id='+id,
    })
  },
  onShow: function () {
   
  },
  onHide: function () {
   
  },
/**
     * 弹窗
     */
    showDialogBtn: function(e) {
      let that = this;
      var id = e.currentTarget.dataset.id;
      var appopenid = this.data.appopenid;
      this.setData({
        showModal: true,
        order_id: id,
      })
    },
    /**
     * 弹出框蒙层截断touchmove事件
     */
    preventTouchMove: function () {
    },
    /**
     * 隐藏模态对话框
     */
    hideModal: function () {
      this.setData({
        showModal: false
      });
    },
    /**
     * 对话框取消按钮点击事件
     */
    onCancel: function () {
      this.hideModal();
    },
    /**
     * 对话框确认按钮点击事件
     */
    onConfirm: function () {
      this.hideModal();
    }

})
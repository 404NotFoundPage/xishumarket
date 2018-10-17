// pages/evaluateGoods/evaluateGoods.js
var api = require('../../utils/pub.js');
var app = getApp();
var flag = true;
Page({

  data: {
    id: '',
    cont: '',
    imgurl: [],

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



  takePicture: function() {
    var this_ = this;
    // console.log(this.data.imgurl.length)
    if (this.data.imgurl.length == 8) {
      wx.showToast({
        title: '只能上传3张',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      wx.chooseImage({
        count: 1, // 上传图片个数
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          console.log(res)
          var tempFilePaths = res.tempFilePaths;
          // console.log(res);
          var val = tempFilePaths.toString();
          let thirdsesid = api.getThirdsesid();
          if( this_.data.imgurl.length < 3 ){
            wx.showLoading({
              title:"上传中~~",
            })
            for(let i=0;i<tempFilePaths.length;i++){
              wx.uploadFile({
                url: app.globalData.urls + 'Shop/MiniIndex/upload', //仅为示例，非真实的接口地址
                filePath: tempFilePaths[i],
                name: 'myimg',
                formData:{
                  thirdsesid :thirdsesid,
                },
                header: { 'content-type': 'multipart/form-data' },
                success: function(res){
                  var data = res.data
                  let data1 = JSON.parse(data);
                  console.log(data1)
                  this_.data.imgurl.push(data1.saveFile);
                    this_.setData({
                      imgurl: this_.data.imgurl
                    })
                  wx.hideLoading()
                  console.log(this_.data.imgurl)
                  //do something
                }
              })
            }
          }else{
            wx.showToast({
              title:"三张图片够了哟",
              icon: 'none',
              duration: 2000,
            })
          }
        }
        })
      
      }
  },
  getValue: function(e) {
    this.setData({
      cont: e.detail.value
    })
  },
  eva: function() {
    var that = this;
    var thirdsesid = api.getThirdsesid();
    // console.log(that.data.imgurl);
    if (flag) {
      wx.request({
        url: app.globalData.urls + 'Shop/MiniIndex/add_comment',
        method: 'POST',
        data: {
          id: that.data.id,
          content: that.data.cont,
          pictures: that.data.imgurl,
          thirdsesid: thirdsesid
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function(res) {
          console.log(res);
          var res = res.data;
          if (res.ret == '0') {
            wx.showToast({
              title: res.msg,
              icon: 'success',
              duration: 2000
            })
            flag = false;
            setTimeout(function() {
              wx.navigateTo({
                url: '../myOrder/myOrder?index=3',
              })
            }, 2000)

          } else {
            wx.showToast({
              title: res.msg,
              // image: '../image/error.png',
              icon: 'none',
              duration: 2000
            })
            flag = true;
          }
        }
      })
    }

  },
  clic:function(e){
    let that = this;
    let i = e.currentTarget.dataset.id
    console.log(i)
    let el = that.data.imgurl.indexOf(i);
    // console.error(el);
    that.data.imgurl.splice( el,1 )
    that.setData({
      imgurl: that.data.imgurl,
    })
    console.log(that.data.imgurl)
  },

  onLoad: function(options) {
    // 判断是否授权  
    // wx.clearStorage();
    var thirdsesid = api.getThirdsesid();
    if (thirdsesid != '' && thirdsesid != undefined) {
      var id = options.id;
      this.setData({
        id: id
      });
      console.log(id);
    } else {
      // wx.navigateTo({
      //   url: '../accredit/accredit',
      // })
      app.onLaunch(); //获取code;
      api.imgurl(that)
      that.setData({
        powerflag: false,
      })
      return false;

    }
    
  },
  onShow: function () {
    
  },
  onHide: function () {
    
  }

})
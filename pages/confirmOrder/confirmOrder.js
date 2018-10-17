// pages/confirmOrder/confirmOrder.js
var api = require('../../utils/pub.js');
var app = getApp();
Page({
  data: {
    is_show: false,
    loadFlag: true,
    loadFlag1: true,
    num: 1,
    de_pr: 80,
    reduce: 0, //使用优惠卷的价格
    number: 1,
    price: '', //原来的单价
    priceall: '', //总价
    price2: '',
    condition: true, //文本框条件
    cshow: true, //页面条件
    ch: false, //立即使用按钮
    datas: '',
    isVip: '',
    id: '', //商品id
    r_id:"",  //传过来的类别id;
    couponid: '', //优惠卷id
    textarea: '',
    g_id: '', //goods表的id
    tid:"",   //类别的id;
    guige2:"",    //规格2;
    totalP:"",     //类别的总价格;
    datacard:"",   //优惠券;
    useconpon:0,  //可用优惠券多少张;
    text:"",
    box:{},  //判断盒子
    payState: true,  //支付状态;
    rule_arr: '',   //规格分类;

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
    console.log(options);
    var id = options.r_id;
    var that = this;
    that.setData({
      r_id: options.r_id || "",
      id : options.id
    });
    //初始化加载
    var thirdsesid = api.getThirdsesid();
    if (thirdsesid != '' && thirdsesid != undefined) {
      var data = {
        id: options.id,
        r_id: options.r_id,
        thirdsesid: thirdsesid
      }
      api.conforder(that, data, callback);
      function callback(res){
        if (res.ret == '0') {
          that.setData({
            datas: res.data,
            isVip: res.isVip,
            g_id: res.data.g_id,
            datacard: res.coupons,
            rule_arr: res.rule_arr,
          });
          if (res.isVip == '0') {
            var priceall = parseFloat(res.data.price).toFixed(2);
            that.setData({
              price: res.data.price,
              priceall: priceall
            });
          } else if (res.isVip == '1') {
            var priceall = parseFloat(res.data.price_vip).toFixed(2);
            that.setData({
              price: res.data.price_vip,
              priceall: priceall
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
      // wx.navigateTo({
      //   url: '../accredit/accredit',
      // })
      app.onLaunch(); //获取code;
      api.imgurl(that)
      that.setData({
        powerflag: false,
      })

    }
    //优惠券初始化;
    setTimeout( function(){
      that.useconponsadd(that, that.data.datacard)
    },800)
  },
//取消支付;
  cancelpay:function(data){
    console.log("取消支付")
    console.log( data )
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
//支付;
  href_payment: function() {
    if( this.data.payState ){
      var that = this;
      that.setData({
        payState: false,   //支付按钮不可点击;
      })
            var prices = that.data.priceall;
            var thirdsesid = api.getThirdsesid();
            var couponid = that.data.couponid || null; //优惠卷id
            var id = that.data.g_id;  //商品 g_id;
            var sum = that.data.num; //购买数量;
            var openGid = wx.getStorageSync('openGid');  //分享的群id;
            var shareId = wx.getStorageSync('shareId');   //分享的商品id;
            var tid = that.data.r_id || 0;//类别id
            var mg_id = that.data.id;
            var fu = wx.getStorageSync('fu') || "";  //来源人标识，可能为空
            //g_ig == shareId时是分享购买
            if( shareId == mg_id && openGid ){
              var data = {
                thirdsesid: thirdsesid,
                prices: prices,
                sum: sum,
                goodid: that.data.datas.g_id,  //商品id;
                tid: tid,   //规格id;
                couponid: couponid,
                opengid: openGid,
                fu: fu,
              };
            }else{
              var data = {
                thirdsesid: thirdsesid,
                prices: prices,
                sum: sum,
                goodid: that.data.datas.g_id,  //商品id;
                tid: tid,   //规格id;
                couponid: couponid,
                fu: fu,
              };
            }
            // console.log(data);
            wx.request({
              url: app.globalData.urls+"Optbuy/Orders/wechatAppOrder",
              method: "POST",
              data: data,
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              success:function(resq){
                if( resq.data.ret == 1){  //支付失败;
                  wx.showToast({
                    title:resq.data.msg,
                    image: "/pages/image/error.png",
                    icon: 'none',
                    duration: 2000
                  })
                  that.setData({
                    payState: true,   //支付按钮不可点击;
                  })
                that.cancelpay(resq.data.resum)
                }else if( resq.data.ret == 0 ){     //支付成功;
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
                          title:'支付成功',
                          icon: 'success',
                          duration: 2000
                        })
                          setTimeout(function () {
                            wx.navigateTo({
                              url: '../myOrder/myOrder?index=0'
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
                      that.setData({
                        payState: true,   //支付按钮不可点击;
                      })
                    },
                  })

                }else if(resq.data.ret == 1001){   //0元支付;
                    wx.showToast({
                      title:resq.data.msg,
                      icon: 'success',
                      duration: 2000
                    })
                      setTimeout(function () {
                        wx.switchTab({
                          url: "../user/user"
                        })
                      }, 2000);
                }
              }
            })
        }
  },
  add: function() { //添加数量 
    console.log()  
    if(this.data.isVip == 0){  //非会员
      let n;
      this.data.datas.limit_buy_sum == '0' ? n = parseInt(this.data.datas.re_sum) : n = this.data.datas.limit_buy_sum;
      if( this.data.number < n ){
        this.setData({
          number: ++this.data.number,
          priceall: parseFloat( this.data.datas.price * this.data.number - this.data.reduce ).toFixed(2),
        });
        //优惠券;
        this.useconponsadd( this,this.data.datacard )
      }else{
        this.setData({
          number: n,
          priceall: parseFloat( this.data.datas.price * this.data.number - this.data.reduce ).toFixed(2),
        });
        //优惠券
        this.useconponsadd( this,this.data.datacard )
      }
    }else if(this.data.isVip == 1){  //会员
      let n;
      this.data.datas.limit_buy_sum == '0' ? n = parseInt(this.data.datas.re_sum) : n = this.data.datas.limit_buy_sum;
      if( this.data.number < n ){
        this.setData({
          number: ++this.data.number,
          priceall: parseFloat( this.data.datas.price_vip * this.data.number - this.data.reduce ).toFixed(2),
        })
        //优惠券
        this.useconponsadd( this,this.data.datacard )
      }else{
        this.setData({
          number: n,
          priceall: parseFloat( this.data.datas.price_vip * this.data.number - this.data.reduce ).toFixed(2),
        })
      }
    }
  },
//可用优惠券;
  useconponsadd:function( that,data ){
    console.log(data)
    for( let i=0 ;i<data.length;i++){
      for( let key in data[i]){
        if( key=='limit' && that.data.priceall >= data[i][key] ){
          that.data.box[i] = data[i][key]
          // let len = data.length;
          // that.data.useconpon = that.data.useconpon + 1 > len ? len: that.data.useconpon + 1; 
        }
      }
    }
    console.log(that.data.box)
    let len = that.countProperties( that.data.box )
    this.setData({
      useconpon: len,
    })
    // console.log( that.data.useconpon )
  },
  useconponssub:function( that,data ){
    for( let i=0 ;i<data.length;i++){
      for( let key in data[i]){
        if( key=='limit' && that.data.priceall < data[i][key] ){
          delete that.data.box[i];
        }
      }
    }
    console.log( that.data.box )  
    let len = that.countProperties( that.data.box )
    this.setData({
      useconpon: len,
    })
  },
//计算box对象的长度;
  countProperties:function(obj){
    　　var count = 0;
        for(var key in obj){
            if(obj.hasOwnProperty(key)){
                count++;
            }
        }
        return count;
    },
  reduce: function() { //减少数量
    let that = this;
    if (this.data.number > 1) {
      if( this.data.isVip == 0){  //非会员
        let curnumber = --this.data.number;
        let curtotalprice = this.data.datas.price * curnumber;
        console.log( curnumber +"---"+curtotalprice+"----"+this.data.couponid )
        if( this.data.couponid ){
          for( let key in this.data.datacard ){
            console.log(this.data.datacard[key].id)
            if( this.data.datacard[key].id == this.data.couponid && curtotalprice < this.data.datacard[key].limit ){
              console.log(11111111111111111111111)
              this.setData({
                number: curnumber,
                priceall: (that.data.datas.price * curnumber).toFixed(2),
                couponid:"",//清空优惠券;
                text:"",
                reduce: 0,  //清空优惠券的价格;
              });
              this.useconponssub(this,this.data.datacard)
            }else{
              this.setData({
                number: curnumber,
                priceall: (that.data.datas.price * curnumber).toFixed(2),
                // couponid:"",//清空优惠券;
                // text:"",
                // reduce: 0,  //清空优惠券的价格;
              });
              this.useconponssub(this,this.data.datacard)
            }
          }
        }else{
          this.setData({
            number: curnumber,
            priceall: (that.data.datas.price * curnumber).toFixed(2),
            couponid:"",//清空优惠券;
            text:"",
            reduce:0,  //清空优惠券的价格;
          });
          this.useconponssub(this,this.data.datacard)
        }
      }else{  //会员
        let curnumber = --this.data.number;
        let curtotalprice = this.data.datas.price_vip * curnumber;
        if( this.data.couponid ){
          for( let key in this.data.datacard){
            if( key==this.data.couponid && curtotalprice < this.data.datacard[key].limit ){
              this.setData({
                number: curnumber,
                priceall: (this.data.datas.price_vip * curnumber).toFixed(2),
                couponid:"",  //清空优惠券;
                text:"",
                reduce:0,    //清空优惠券的价格;
              });
              this.useconponssub(this,this.data.datacard)
            }else{
              this.setData({
                number: curnumber,
                priceall: (this.data.datas.price_vip * curnumber).toFixed(2),
                // couponid:"",  //清空优惠券;
                // text:"",
                // reduce:0,    //清空优惠券的价格;
              });
              this.useconponssub(this,this.data.datacard)
            }
          }
        }else{
          this.setData({
            number: curnumber,
            priceall: (this.data.datas.price_vip * curnumber).toFixed(2),
            couponid:"",  //清空优惠券;
            text:"",
            reduce:0,    //清空优惠券的价格;
          });
          this.useconponssub(this,this.data.datacard)
        }
      }
    }
  },
  show: function() {
    var that = this;
    if( that.data.useconpon ){
      that.setData({
        is_show: true,
        condition: false,
        cshow: false
      })
    }
  },
  close: function() {
    this.setData({
      is_show: false,
      condition: true,
      cshow: true
    })
  },
  //使用优惠卷
  select: function(e) {
    console.log(e.currentTarget.dataset)
    this.setData({
      text: e.currentTarget.dataset.text,
      couponid: e.currentTarget.dataset.id,
      reduce: e.currentTarget.dataset.price,
      is_show: false,
      condition: true,
      cshow: true,
    });
    this.setData({
      priceall: parseFloat(this.data.price * this.data.number - this.data.reduce).toFixed(2),
    })
    console.log(this.data.priceall);

  },
  bindTextAreaBlur: function(e) {
    this.setData({
      textarea: e.detail.value
    })
  },
  onShow: function () {
    // let that = this;
    // //下面是很可能会出问题的地方;
    // wx.checkSession({
    //   success: function () {
    //     //session_key 未过期，并且在本生命周期一直有效
    //     return;
    //   },
    //   fail: function () {
    //     console.log("session_key已经失效，需要重新执行登录流程")
    //     // session_key 已经失效，需要重新执行登录流程
    //     app.onLaunch()
    //     api.imgurl(that);
    //     //  wx.navigateTo({
    //     //    url:"../accredit/accredit"
    //     //  })
    //     that.setData({
    //       powerflag: false,
    //     })
    //   }
// })
  },
  onHide: function () {
    
  }

})
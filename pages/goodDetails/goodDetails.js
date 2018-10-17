var api = require('../../utils/pub.js');
var app = getApp();
Page({
  data: {
    id: 0,
    p: 1,
    currentTab: 0,
    loadFlag: true,
    loadFlag1: true,
    oilchooseFlag: true,
    comment: true, //评论加载更多
    none: false, //无评论
    num: 0,
    winHeight: '',
    height: 0, //swi_p1高度
    height1: 0, //swi_p2高度
    swiperCurrent: 0,
    datas: '', //详情数据
    dataCom: '', //评论数据
    shop: '', //商家信息
    isvip: '', //0不是vip,1是vip

    phonenumber: "", //客服电话
    xishuphone: "", //西蜀电话;
    sharestate: true, //分享蒙层;
    posterimage: "", //海报分享地址
    postState: true, //生成海报的可点击装态;
    animate: {},
    zIndex: -1,
    tiptext: true, //长按保存文字
    price_area: "", //价格区间;
    rule_data: "", //规格data
    rules: "", //规格分类
    standard_ani: {}, //规格动画;
    // bottom:"",     //规格元素的底部位置;
    temp: "",
    stant_index: 999,
    price_area: "", //价格范围;
    defaultsrc: "", //默认的图片地址;
    activekey: "", //激活类名的key;
    activekey2: "", //激活类名的key2;
    catestr: "", //选择的类别1;
    catestr2: "", //选择的类别2;
    tid: "", //tid;
    selectstandardstr1: "", //选中规格的文字;
    selectstandardstr2: "", //选中规格的文字;
    price: "", //普通价格;
    price_vip: "", //会员价格;
    richcontent: "", //富文本内容;
    texttips: "", //未选择规格时的提示;
    selecttext1: "", //请选择提示内容1;
    selecttext2: "", //请选择提示内容2;
    selectresum: "", //选中的库存;
    selectflag: true,
    isbuy: "", //可不可购买;
    // share_zindex:"",
    creatpoststate: true, //海报生成的时候点击背景不隐藏;
    //二次开发;
    share_height: "", //分享元素的高度;
    isshare: "", //判断是不是有收益中心;
    userid: "", //用户身份标识;
    Opacity: 0, //遮罩层的透明度;
    shareArr: "", //分享文字;
    back_top_opacity: 0,
    back_top_zIndex: -999,
    powerflag: true, //授权显示装态;
    powerimgurl: "", //授权头像;
    bindPhone: "", //是否绑定手机;
    login: "0",   //绑定手机注册回到详情页面不清除群id标志;
  },
  //授权请求事件
  index: function () {
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
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      console.log(e);
      // if ( !app.globalData.userInfo ){    //可能会出错的地方;
      //    app.Loagin();
      //   }
      api.bindGetUserInfo(e, that, callback);

      function callback(res) {
        if (that.data.pwdpageurl && res.ret == '0') {
          wx.navigateTo({
            url: that.data.pwdpageurl,
          })
        } else {
          //用户按了拒绝按钮
        }
      }
    }
  },


  //点击分享
  myshare() {
    console.log("分享")
    let ani = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
    })
    ani.bottom(0).step();
    this.setData({
      sharestate: false,
      animate: ani.export(),
    })
  },
  //取消分享
  cancelshare() {
    if (this.data.creatpoststate) {
      console.log("取消分享")
      let that = this;
      if (that.data.posterimage) {
        that.setData({
          tiptext: true,
          zIndex: -1,
          posterimage: "",
          Opacity: 0,
        })
      }
      //微信朋友圈分享隐藏;
      let ani = wx.createAnimation({
        duration: 400,
        timingFunction: 'ease',
      })
      ani.bottom(this.data.share_height).step();
      this.setData({
        sharestate: true,
        animate: ani.export(),
      })
      //规格元素隐藏
      let stant_an = wx.createAnimation({
        duration: 400,
        timingFunction: 'ease',
      })
      stant_an.bottom(-500).step();
      this.setData({
        sharestate: true,
        standard_ani: stant_an.export(),
      })
    }
  },
  //海报推荐
  shareposter() {
    let goodid = "";
    let that = this;
    var thirdsesid = api.getThirdsesid();
    let anima = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
    })
    that.setData({
      animate: anima.bottom(that.data.share_height).step(),
      creatpoststate: false, //蒙层切换为不可点击;
      Opacity: 0.7,
    })
    wx.showLoading({
      title: "正在生成海报~~",
      success: function (res) {
        that.setData({
          postState: false,
        })
      }
    })
    // wx.getStorage({
    //   key: 'id',
    //   success: function(res) {
    goodid = that.data.id;
    wx.request({
      url: app.globalData.urls + "Shop/Poster/createPost",
      method: 'POST',
      data: {
        thirdsesid: thirdsesid,
        id: goodid,
        nickname: app.globalData.userInfo.nickName,
        headimg: app.globalData.userInfo.avatarUrl,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        // console.log(res.data)
        if (res.data.ret == "0") {
          let anima = wx.createAnimation({
            duration: 400,
            timingFunction: 'ease',
          })
          wx.hideLoading()
          that.setData({
            posterimage: res.data.url,
            zIndex: 9999,
            tiptext: false,
            postState: true, //生成海报按钮可点击装态;
            creatpoststate: true,
          })
        }
      },
    })
    //   } 
    // })

  },
  //长按保存;
  longtapsaveImg() {
    let that = this;
    wx.downloadFile({
      url: that.data.posterimage, //先将图片下载下来;
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
  //取消滑动蒙层移动;
  _cancelmove(){
    return false;
  },
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  govip() {

    wx.navigateTo({
      url: '../vip/vip',
    })
  },
  //监听页面滚动条高度;
  onPageScroll(e) {
    let that = this;
    if (e.scrollTop > 50) {
      setTimeout(function () { //显示top按钮
        that.setData({
          back_top_opacity: 0.7,
          back_top_zIndex: 999,
        })
      }, 200)
    } else {
      setTimeout(function () { //隐藏top按钮;
        that.setData({
          back_top_opacity: 0,
          back_top_zIndex: -999,
        })
      }, 200)
    }
  },
  //点击回到顶部;
  back_top() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    })
  },

  onLoad: function (options) {
    console.log(options)
    console.log(app.globalData.options_scene.query.id)
    if( options ){
      app.globalData.optionsGoodtails = options;  //options存入全局;
    }
    try {
      wx.setStorageSync('sp_id', options.id);
    } catch (e) {}

    console.log(app.globalData.optionsGoodtails)
    if( app.globalData.optionsGoodtails.hasOwnProperty('login') ){
      this.setData({
        login: app.globalData.optionsGoodtails.login
      })
    }
    var that = this;
    var id =  wx.getStorageSync('sp_id') || app.globalData.options_scene.query.id ;
    // console.log(id)   //获取跳转的id：
    that.setData({
      id: id,
      // 二次开发;

    })
    // 判断是否授权  
    // wx.clearStorage();
    var thirdsesid = api.getThirdsesid();
    if (thirdsesid != '' && thirdsesid != undefined) {
      console.log(that.data.id)
      var data = {
        id: that.data.id,
        fu: app.globalData.options_scene.query.fu || null ,
        thirdsesid: thirdsesid
      }
      api.goodsdetails(that, data, callback);

      function callback(res) {
        if (res.ret == '0') {
          let result = res.data.g_infor; //富文本图片宽度解决;
          const regex = new RegExp('<img', 'gi');
          result = result.replace(regex, `<img style="max-width: 100%;"`);
          // this.content = result;
          that.setData({
            selectresum: res.data.re_sum, //总的库存;
            datas: res.data,
            richcontent: result, //富文本
            shop: res.shop,
            isvip: res.isVip,
            price_area: res.price_area,
            rule_data: res.rule_data,
            rules: res.rules,
            isbuy: res.isbuy,
            isshare: res.isshare,
            userid: res.userid, //用户身份标识;
            shareArr: res.shareArr, //分享文字;
            bindPhone: res.bindPhone, //是否绑定手机;
          });
          if (res.data.rules) {
            for (let key in res.data.rules.lev_1p) {
              that.setData({
                selectstandardstr1: res.data.rules.lev_1p[key]
              })
            }
            if (res.data.rules.lev_2p) {
              for (let key in res.data.rules.lev_2p) {
                selectstandardstr2: res.data.rules.lev_2p[key]
              }
            }

          }
          //获取规格元素的高度;
          //创建节点选择器
          var query = wx.createSelectorQuery();
          //选择id
          setTimeout(function () {
            query.select('.standard').boundingClientRect(function (rect) {
              // console.log(rect)
              that.setData({
                bottom: "-" + rect.height + 'px',
                temp: "-" + rect.height,
              })
            }).exec()
          }, 200);

          //获取分享元素的高度;
          //创建节点选择器
          var query = wx.createSelectorQuery();
          //选择id
          setTimeout(function () {
            query.select('.share').boundingClientRect(function (rect) {
              // console.log(rect)
              that.setData({
                share_height: "-" + rect.height + 'px',
              })
            }).exec()
          }, 300);
        } else {
          wx.showToast({
            title: res.msg,
            // image: '../image/error.png',
            icon: 'none',
            duration: 2000
          })
        }
        var query = wx.createSelectorQuery();
        //设置swi_p1高度
        setTimeout(function () {
          query.select('#swi_p1').boundingClientRect(function (rect) {
            // console.log(rect);
            that.setData({
              height: rect.height + 10
            })
          }).exec();
        }, 800)
      }
    } else {
      // wx.navigateTo({
      //   url: '../accredit/accredit',
      // })
      api.imgurl(this)
      that.setData({
        powerflag: false,
      })
    }
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function (options) {
  },
  //滑动切换
  swiperTab: function (e) {
    var that = this;
    var currentTab = e.detail.current;
    that.setData({
      currentTab: e.detail.current,
      p: that.data.p,
    });
    var query = wx.createSelectorQuery();
    if (currentTab == '1') {
      query.select('#swi_p2').boundingClientRect(function (rect) {
        // console.log(rect);
        that.setData({
          height1: 200,
          comment: true, //评论加载更多
          none: false, //无评论
        })
      }).exec();

      // 设置swi_p2高度
      setTimeout(function () {
        query.select('#swi_p2').boundingClientRect(function (rect) {
          // console.log(rect);
          that.setData({
            height1: rect.height,
            comment: true, //评论加载更多
            none: false, //无评论
          })
        }).exec();
      }, 700)
      var thirdsesid = api.getThirdsesid();
      var data = {
        id: that.data.id,
        p: that.data.p,
        thirdsesid: thirdsesid
      }
      console.log(that.data.p)
      if (that.data.p == 1) {
        api.comment(that, data, callback);

        function callback(res) {
          if (res.ret == '0') {
            if (res.data.length != 0) {
              that.setData({
                dataCom: res.data,
                p: that.data.p += 1,
              })
              // console.log(that.data.dataCom);
            } else {
              console.log(res.data.p)
              that.setData({
                p: that.data.p += 1,
              })
            }
          } else {
            that.setData({
              none: true,
              comment: false,
              p: that.data.p += 1, //评论的请求控制;
            })
          }
        }
      }
    } else {
      // 设置swi_p1高度
      setTimeout(function () {
        query.select('#swi_p1').boundingClientRect(function (rect) {
          that.setData({
            height: rect.height,
            comment: true, //评论加载更多
            none: false, //无评论
          })
        }).exec();
      }, 700)
    }
  },
  //点击加载更多
  loadMore: function () {
    var that = this;
    var thirdsesid = api.getThirdsesid();
    var data = {
      id: that.data.id,
      p: that.data.p,
      thirdsesid: thirdsesid
    }
    api.commentmore(that, data, callback);

    function callback(res) {
      if (res.ret == '0') {
        if (res.data.length != 0) {
          that.setData({
            dataCom: that.data.dataCom.concat(res.data),
            p: that.data.p += 1
          })
          var query = wx.createSelectorQuery();
          //设置swi_p2高度
          setTimeout(function () {
            query.select('#swi_p2').boundingClientRect(function (rect) {
              console.log(rect);
              that.setData({
                height1: rect.height
              })
            }).exec();
          }, 1000)
          console.log(that.data.dataCom);
        } else {
          wx.showToast({
            title: '没有更多评论了',
            // image: '../image/error.png',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            none: true,
            comment: false
          })
        }
      } else {
        wx.showToast({
          title: res.msg,
          // image: '../image/error.png',
          icon: 'none',
          duration: 2000
        })
        that.setData({
          comment: false, //评论加载更多
          none: true, //无评论
        })
      }
    }

  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        p: that.data.p
      })
      var query = wx.createSelectorQuery();
      if (that.data.currentTab == '1') {
        //设置swi_p2高度
        setTimeout(function () {
          query.select('#swi_p2').boundingClientRect(function (rect) {
            that.setData({
              height1: rect.height,
              comment: true, //评论加载更多
              none: false, //无评论
            })
          }).exec();
        }, 700)
      } else {
        //设置swi_p2高度
        setTimeout(function () {
          query.select('#swi_p1').boundingClientRect(function (rect) {
            that.setData({
              height: rect.height,
              comment: true, //评论加载更多
              none: false, //无评论
            })
          }).exec();
        }, 700)
      }
    }
  },
  call: function (e) { //电话
    api.callTel(e);
  },
  gation: function (e) { //导航
    let that = this;
    var dation = e.target.dataset.dation.split(',');
    console.log(dation);
    var lng = Number(dation[0]);
    var lat = Number(dation[1]);
    wx.openLocation({
      latitude: lat,
      longitude: lng,
      scale: 18,
      name: that.data.shop.name,
      address: that.data.shop.address
    })
  },
  //点击购买;
  href_order: function () {
    var that = this;
    var id = that.data.datas.id;
    if (that.data.bindPhone == 0) { //未绑定手机;
      var pages = getCurrentPages() //获取加载的页面
      var currentPage = pages[pages.length - 1] //获取当前页面的对象
      var url = currentPage.route //当前页面url
      console.log(url);
      wx.navigateTo({ 
        url: '../webview/webview?originurl=' + url + '&id=' + id+'&login=1&fu=' + app.globalData.options_scene.query.fu || 0,
      })
    } else { //以绑定手机;
      if (that.data.rule_data != null) {
        //选择规格;
        for (let key in that.data.rules.lev_1p) {
          that.setData({
            selecttext1: that.data.rules.lev_1p[key],
          })
        }
        if (that.data.rules.lev_2p) {
          for (let key in that.data.rules.lev_2p) {
            that.setData({
              selecttext2: that.data.rules.lev_2p[key],
            })
          }
        }
        let ani = wx.createAnimation({
          duration: 400,
          timingFunction: 'ease',
        })
        ani.bottom(0).step();
        that.setData({
          defaultsrc: that.data.datas.list_pic_2, //默认的图片地址;
          sharestate: false,
          standard_ani: ani.export(),
        })
      } else {
        wx.navigateTo({
          url: '../confirmOrder/confirmOrder?id=' + id
        })
      }
    }
  },
  //点击关闭;
  closestand() {
    //规格元素隐藏
    let that = this;
    let stant_ani = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
    })
    stant_ani.bottom(-500).step();
    this.setData({
      sharestate: true,
      standard_ani: stant_ani.export(),
    })
  },
  //规格选择;
  lav_1(e) {
    let that = this;
    this.setData({
      activekey: e.target.dataset.key,
      catestr: e.target.dataset.key,
      selecttext1: e.target.dataset.info,
    })
    //获取选中的文字;
    for (let items in this.data.rules.lev_1) {
      if (e.target.dataset.key == items) {
        this.setData({
          selectstandardstr1: that.data.rules.lev_1[items],
          selectstandardstr2: that.data.selectstandardstr2,
          selectflag: false,
        })
      }
    }
    //取价格;
    for (let items in this.data.rule_data) {
      let str = e.target.dataset.key.toString();
      if (that.data.catestr2) {
        str = str + that.data.catestr2.toString();
      } else {
        str += "";
      }
      if (str == items) {
        this.setData({
          price: that.data.rule_data[items].price,
          selectresum: that.data.rule_data[items].re_sum,
          selectflag: false,
          // price_vip: that.data.rule_data[items].price_vip,
          price_area: "",
        })
      }
    }
    if (this.data.rule_data == null) {
      //设置图片;
      let key = this.catestr;
      for (let itmes in this.data.rule_data) {
        if (key == items) {
          this.setData({
            defaultsrc: that.data.rule_data[items].pic,
            tid: that.data.rule_data[items].id,
            selectresum: that.data.rule_data[items].re_sum,
            price: that.data.rule_data[items].price,
            selectflag: false,
            // price_vip: that.data.rule_data[items].price_vip,
            price_area: "",
          })
        }
      }
      //获取选中的文字;
      for (let items in this.data.rules.lev_1) {
        if (key == items) {
          this.setData({
            selectstandardstr1: that.data.rules.lev_1[items]
          })
        }
      }
    }
  },
  lav_2(e) {
    let that = this;
    this.setData({
      activekey2: e.target.dataset.key,
      catestr2: e.target.dataset.key,
      selecttext2: e.target.dataset.info,
    })
    //获取选中的文字;
    for (let items in this.data.rules.lev_2) {
      if (e.target.dataset.key == items) {
        this.setData({
          selectstandardstr2: that.data.rules.lev_2[items],
          selectstandardstr1: that.data.selectstandardstr1,
          selectflag: false,
        })
      }
    }
    if (that.data.catestr != "" && that.data.catestr2 != "") {
      let str = that.data.catestr.toString() + that.data.catestr2.toString();
      for (let key in that.data.rule_data) {
        if (key == str) {
          if (that.data.rule_data[key].pic) { //如果没有地址就设置图片默认地址
            this.setData({
              defaultsrc: that.data.rule_data[key].pic,
              tid: that.data.rule_data[key].id,
              price: that.data.rule_data[key].price,
              selectresum: that.data.rule_data[key].re_sum,
              selectflag: false,
              // price_vip: that.data.rule_data[key].price_vip,
              price_area: "",
            })
          } else {
            that.setData({
              defaultsrc: that.data.datas.list_pic_2, //默认的图片地址;
              tid: that.data.rule_data[key].id,
              price: that.data.rule_data[key].price,
              selectresum: that.data.rule_data[key].re_sum,
              selectflag: false,
              // price_vip: that.data.rule_data[key].price_vip,
              price_area: "",
            })
          }
        }
      }
    }
  },
  //确定点击确认下单;
  confirmpurcher() {
    let that = this;
    let id = that.data.datas.id;
    if (that.data.rule_data != null && that.data.rules.lev_2p != undefined) { //两个类别;
      if (that.data.catestr != "" && that.data.catestr2 != "") {
        let str = that.data.catestr.toString() + that.data.catestr2.toString();
        let str1 = that.data.selectstandardstr1;
        let str2 = that.data.selectstandardstr2;
        let totalprice = that.data.price || that.data.price_vip;
        console.log(str)
        console.log(that.data.rule_data[str].id);
        console.log(that.data.id)
        wx.navigateTo({
          url: '../confirmOrder/confirmOrder?r_id=' + that.data.rule_data[str].id + "&id=" + that.data.id,
        })
      } else {
        wx.showToast({
          title: "请选择规格",
          duration: 2000,
          mask: true,
          icon: 'none',
        })
      }
    } else {
      if (that.data.catestr != "") {
        let str1 = that.data.selectstandardstr1;
        let totalprice = that.data.price || that.data.price_vip;
        let str = that.data.catestr.toString()
        console.log(str);
        console.log(that.data.rule_data[str].id);
        wx.navigateTo({
          url: '../confirmOrder/confirmOrder?r_id=' + that.data.rule_data[str].id + "&id=" + that.data.id,
        })
      } else {
        wx.showToast({
          title: "请选择规格",
          duration: 2000,
          mask: true,
          icon: 'none'
        })
      }
    }

  },
  youxuan: function () {
    wx.switchTab({
      url: '../index/index'
    })
  },
  //图片预览
  imglooks: function (e) {
    api.imgLook(e);
  },
  //跳转到收益界面;
  jump_myshop() {
    wx.navigateTo({
      url: '../myshops/myshops',
    })
  },
  onPullDownRefresh: function () { //下拉刷新
    var that = this;
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    var thirdsesid = api.getThirdsesid();
    if (thirdsesid != '' && thirdsesid != undefined) {
      console.log(that.data.id)
      var data = {
        id: that.data.id,
        thirdsesid: thirdsesid
      }
      api.goodsdetails(that, data, callback);

      function callback(res) {
        console.log(res.data)
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        if (res.ret == '0') {
          let result = res.data.g_infor; //富文本图片宽度解决;
          const regex = new RegExp('<img', 'gi');
          result = result.replace(regex, `<img style="width: 100%;"`);
          that.setData({
            selectresum: res.data.re_sum, //总的库存;
            datas: res.data,
            richcontent: result, //富文本
            shop: res.shop,
            isvip: res.isVip,
            price_area: res.price_area,
            rule_data: res.rule_data,
            rules: res.rules,
            isbuy: res.isbuy,
            isshare: res.isshare,
            userid: res.userid, //用户身份标识;
            shareArr: res.shareArr, //分享文字;

            p: 1, //评论初始页码为1,
          });
          if (res.data.rules) {
            for (let key in res.data.rules.lev_1p) {
              that.setData({
                selectstandardstr1: res.data.rules.lev_1p[key]
              })
            }
            if (res.data.rules.lev_2p) {
              for (let key in res.data.rules.lev_2p) {
                selectstandardstr2: res.data.rules.lev_2p[key]
              }
            }

          }
          //获取规格元素的高度;
          //创建节点选择器
          var query = wx.createSelectorQuery();
          //选择id
          setTimeout(function () {
            query.select('.standard').boundingClientRect(function (rect) {
              // console.log(rect)
              that.setData({
                bottom: "-" + rect.height + 'px',
                temp: "-" + rect.height,
              })
            }).exec()
          }, 200);

          //获取分享元素的高度;
          //创建节点选择器
          var query = wx.createSelectorQuery();
          //选择id
          setTimeout(function () {
            query.select('.share').boundingClientRect(function (rect) {
              // console.log(rect)
              that.setData({
                share_height: "-" + rect.height + 'px',
              })
            }).exec()
          }, 300);
        } else {
          wx.showToast({
            title: res.msg,
            // image: '../image/error.png',
            icon: 'none',
            duration: 2000
          })
        }
        var query = wx.createSelectorQuery();
        //设置swi_p1高度
        setTimeout(function () {
          query.select('#swi_p1').boundingClientRect(function (rect) {
            // console.log(rect);
            that.setData({
              height: rect.height + 10
            })
          }).exec();
        }, 800)
      }
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log(res)
    var that = this;
    var id = that.data.id;
    wx.showShareMenu({
      withShareTicket: true,
      success: function (res) {
        console.log('分享成功');
        // 分享成功
        let anima = wx.createAnimation({
          duration: 400,
          timingFunction: 'ease',
        })
        that.setData({
          animate: anima.bottom(that.data.share_height).step(),
          sharestate: true,
        })

      },
      fail: function (res) {
        // 分享失败
        console.log("分享失败")
      }
    })
    return {
      title: that.data.datas.title,
      path: '/pages/goodDetails/goodDetails?id=' + id + '&fu=' + that.data.userid,
      // imageUrl: that.data.datas.pic_carous[0],
      // imageUrl: that.data.datas.list_pic_3,   //分享图片;
    }
  },
  onShow: function () {
    let that = this;
    console.log(app.globalData.options_scene.scene)
    let scene = app.globalData.options_scene.scene;
    console.log(app.globalData)
    wx.showShareMenu({
      withShareTicket: true,
    })
    
    if (app.globalData.options_scene.scene == '1044' && app.globalData.options_scene.query.id) {
      try {
        wx.setStorageSync('id', app.globalData.options_scene.query.id);
        wx.setStorageSync('shareId', app.globalData.options_scene.query.id);
      } catch (e) {}
    }
    if (app.globalData.options_scene.scene == '1044') { //群分享小卡片进入方式;
      wx.getShareInfo({
        shareTicket: app.globalData.options_scene.shareTicket,
        complete: function (res) {
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
              console.log('分享群的响应');
              console.log(res);
              if (res.ret == '0') {
                var openGid = res.openGid;
                console.log('分享的openGid' + res.openGid);
                try {
                  wx.setStorageSync('openGid', openGid);
                  wx.setStorageSync('fu', app.globalData.options_scene.query.fu);
                } catch (e) {}
                app.globalData.options_scene.scene = "";   //清理群卡片进入的场景值;
              } else if (res.ret == 1) {
                try {
                  wx.removeStorageSync("openGid")
                  wx.removeStorageSync("shareId")
                  wx.removeStorageSync("fu")
                } catch (e) {
                  // console.log(e);
                  // Do something when catch error
                }
              }
            }
          })
        }
      })
    } else if (scene == 1047 || scene == 1048 || scene == 1049) { //二维码分享进入方式
      console.log("_____  " + app.globalData.options_scene.query.fu)
      try {
        wx.setStorageSync('id', app.globalData.options_scene.query.id);
        wx.setStorageSync('shareId', app.globalData.options_scene.query.id);
        wx.setStorageSync('fu', app.globalData.options_scene.query.fu);
      } catch (e) {}
    } else if (scene == 1007) { //单人聊天分享方式;
      try {
        wx.setStorageSync('fu', app.globalData.options_scene.query.fu);
        wx.setStorageSync('id', app.globalData.options_scene.query.id);
      } catch (e) {}
    } else { //
      if( that.data.login != 1 ){
        try {
          wx.removeStorageSync("openGid")
          wx.removeStorageSync("shareId")
          wx.removeStorageSync("fu")
        } catch (e) {}
      }
      if( scene == 1007 || scene == 1044 || scene == 1047 || scene == 1048 || scene == 1049 ){   //正常进入方式不重新加载onload
        console.log("重新加载："+ scene )
         that.onLoad();
      }
    }

    //下面是很可能会出问题的地方;
    wx.checkSession({
      success: function () {
        //session_key 未过期，并且在本生命周期一直有效
        return;
      },
      fail: function () {
        console.log("session_key已经失效，需要重新执行登录流程")
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
  onHide: function () {

  }


})
const app = getApp();
Page({
  data: {
    user: '登录',
    userNumber:'',
    headpic: "../../../image/mine_03.png",
    tab: 0,
    is_bn:'',
    coverimg: '../../../image/lackBook.png',
    isLogin: false
  },
  tab_slide: function(e) {
    var that = this;
    that.setData({ tab: e.detail.current });
  },
  tab_click: function(e) {
    var that = this;
    if (that.data.tab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        tab: e.target.dataset.current
      })
    }
  },
  onLoad() {
    my.getAuthCode({
      scopes: 'auth_user',
      success: (res) => {
        my.getAuthUserInfo({
          success: (userInfo) => {
            this.setData({
              headpic: userInfo.avatar
            })
          },
        });
      },
    });
  },
  isLogin: function(e) {
    if (this.data.user == '登录') {
      my.navigateTo({
        url: "../login/passwordLogin/passwordLogin"
      })
    }
  },
  onShow: function() {
    var _this = this;
    my.httpRequest({
      url: app.globalData.server + '/api/v5/mini/myInfo',
      data: {
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: function(res) {
        if (res.data.status) {
          _this.setData({
            user: res.data.userExt.formatMobile,
            userNumber: res.data.userExt.nickname,
            isLogin: true
          })
        }else{
          _this.setData({
            user: '登录',
            userNumber: '',
            isLogin: false
          })
        }
      }
    });
    _this.mybookShelf();
    _this.notice();
  },
  mybookShelf:function(){
    var _this = this;
    my.httpRequest({
      url: app.globalData.server + '/api/user/myBookshelf',
      data: {
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: function(res) {
        var bookList = res.data.bookList;
        for (var index in bookList) {
          var coverimg = (bookList[index].coverimg).split("&&")[0];
          if (coverimg.indexOf("//img") == -1 && coverimg.indexOf("http") == -1) {
            bookList[index].coverimg = app.globalData.server + coverimg;
          }
        }
        _this.setData({
          bookList: bookList
        })
      }
    })
  },
  notice:function(){
    var _this = this;
    my.httpRequest({
      url: app.globalData.server + '/api/user/messageList',
      data: {
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: function(res) {
        var messageList=res.data.messageList;
        _this.setData({
          messageList: messageList
        })
      }
    })
  },
  longTaps: function(query) {
    var _this=this;
    var is_bn = query.currentTarget.dataset.id;
    _this.setData({
      is_bn:is_bn
    })
    my.confirm({
      title:'温馨提示',
      content:'您是否要删除该图书',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      success: (res) => {
        if(res.confirm){
          my.httpRequest({
            url: app.globalData.server + '/api/user/deleteBookshelf/'+is_bn,
            data: {
              openid: app.globalData.openid,
              client: 'alipay_mini'
            },
            success: (res) => {
              _this.mybookShelf();
            },
          });
        }
      },
    });
  },
  // 图书封面显示错误时用默认封面代替
  errorCoverimg: function(e) {
    if (e.type == "error") {
      var errorImgIndex = e.target.dataset.errorimg //获取错误图片循环的下标
      var bookList = this.data.bookList;
      var imgList = this.data.bookList; 　  //将图片列表数据绑定到变量
      imgList[errorImgIndex].coverimg = "../../../image/lackBook.png"; //错误图片替换为默认图片
      this.setData({
        bookList: bookList
      })
    }
  },
  onPullDownRefresh() {
    my.httpRequest({
      url: app.globalData.server + '/api/user/messageList',
      data: {
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: function(res) {
        my.stopPullDownRefresh()
      }
    })
  },
  onShareAppMessage() {
    return {
      title: '书堆儿',
      desc: '免费借阅纸质图书，快递配送，全程免费',
      path: 'pages/index/index'
    };
  },
});

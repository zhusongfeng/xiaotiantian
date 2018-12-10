const app = getApp();
Page({
  data: {
    server: app.globalData.server,
    hiddenLoading: false,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 800,
    // 首页专题
    newbooks: '',
    quickbooks: '',
    code: '',
    swiperCurrent:0
  },
  durationChange: function(e) {
    this.setData({
      duration: e.detail.value
    })
  },
  swiperChange: function(e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  swipclick: function() {
    my.navigateTo({
      url: '../component/books/books?subject_id=' + this.data.slideItemList[this.data.swiperCurrent].object_id
    })
  },
  onLoad(query) {
    var _query = query;
    var _this = this;
    my.httpRequest({
      url: app.globalData.server + '/api/v4',
      data: {
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: function(res) {
        var slideItemList = res.data.slideItemList;
        var newbooks = res.data.newbooks;
        var quickbooks = res.data.quickbooks;
        for (var index in newbooks.bookList) {
          var coverimg = newbooks.bookList[index].coverimg;
          if (coverimg.indexOf("//img") == -1 && coverimg.indexOf("http") == -1) {
            newbooks.bookList[index].coverimg = app.globalData.server + coverimg;
          }
        }
        for (var index in quickbooks.bookList) {
          var coverimg = quickbooks.bookList[index].coverimg;
          if (coverimg.indexOf("//img") == -1 && coverimg.indexOf("http") == -1) {
            quickbooks.bookList[index].coverimg = app.globalData.server + coverimg;
          }
        }
        for (var index in slideItemList) {
          slideItemList[index].picurl = app.globalData.server + (slideItemList[index].picurl).split("&&")[0];
        }

        var subjectList = res.data.subjectList;
        for (var index in subjectList) {
          var id = subjectList[index].id;
          if (subjectList[index].coverimg != null) {
            var coverimg = (subjectList[index].coverimg).split("&&")[0];
            if (coverimg.indexOf("//img") == -1 && coverimg.indexOf("http") == -1) {
              subjectList[index].coverimg = app.globalData.server + coverimg;
            }
          }
        }
        _this.setData({
          newbooks: newbooks,
          quickbooks: quickbooks,
          slideItemList: slideItemList,
          subjectList: subjectList,
        })
      }
    })
    my.getAuthCode({
      scopes: 'auth_base',
      success: (res) => {
        if (res.authCode) {
          my.getAuthUserInfo({
            success: (res) => {
            },
          });
          my.httpRequest({
            url: app.globalData.server + '/api/v5/zhima/getUserid',
            data: {
              code: res.authCode,
              openid: app.globalData.openid,
              client: 'alipay_mini'
            },
            success: (res) => {
              if (res.data.status) {
                app.globalData.openid = res.data.openid;
                my.setStorage({
                  key: 'openid',
                  data: {
                    openid: '2088222302514980'
                  }
                });
                app.globalData.openid = res.data.openid;
              }
            }
          })
        }
      },
    });
    
    my.httpRequest({
      url: app.globalData.server + '/api/v5/user/recommendBook',
      data: {
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: (res) => {
        var bookList = res.data.bookList;
        for (var index in bookList) {
          if (bookList[index].coverimg != null) {
            var coverimg = bookList[index].coverimg;
            if (coverimg.indexOf("//img") == -1 || coverimg.indexOf("http") == -1) {
              bookList[index].coverimg = app.globalData.server + coverimg;
            }
          }
        }
        _this.setData({
          bookList: bookList,
        })
      }
    })
  },
  scan: function() {
    // my.scan({
    //   type: 'qr',
    //   success: (res) => {
    //   },
    //   error: (res) => {
    //   }
    // });
    my.navigateTo({
      url:'../component/sellBook/sellBook'
    });
  },
  batch: function() {
    my.httpRequest({
      url: app.globalData.server + '/api/v5/user/recommendBook',
      data:{
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: (res) => {
        var bookList = res.data.bookList;
        for (var index in bookList) {
          if (bookList[index].coverimg != null) {
            var coverimg = bookList[index].coverimg;
            if (coverimg.indexOf("//img") == -1 || coverimg.indexOf("http") == -1) {
              bookList[index].coverimg = app.globalData.server + coverimg;
            } 
          }
        }
        this.setData({
          bookList: bookList,
          hiddenLoading: true,
        })
      }
    })
  },
  // 图书封面显示错误时用默认封面代替
  errorCoverimgNewbooks: function(e) {
    if (e.type == "error") {
      var errorImgIndex = e.target.dataset.errorimg //获取错误图片循环的下标
      var newbooks = this.data.newbooks;
      var imgList = this.data.newbooks.bookList; 　  //将图片列表数据绑定到变量
      imgList[errorImgIndex].coverimg = "../../image/lackBook.png"; //错误图片替换为默认图片
      this.setData({
        newbooks: newbooks,
      });
    } 
  },
  errorCoverimgQuickbooks: function(e) {
    if (e.type == "error") {
      var errorImgIndex = e.target.dataset.errorimg //获取错误图片循环的下标
      var quickbooks = this.data.quickbooks;
      var imgList = this.data.quickbooks.bookList;
      imgList[errorImgIndex].coverimg = "../../image/lackBook.png";
      this.setData({
        quickbooks: quickbooks,
      });
    }
  },
  errorCoverimgRecommend: function(e) {
    if (e.type == "error") {
      var errorImgIndex = e.target.dataset.errorimg //获取错误图片循环的下标
      var bookList = this.data.bookList;
      var imgList = this.data.bookList;
      imgList[errorImgIndex].coverimg = "../../image/lackBook.png";
      this.setData({
        bookList: bookList,
      });
    }
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: '书堆儿',
      desc: '免费借阅纸质图书，快递配送，全程免费',
      path: 'pages/index/index',
    };
  },
  onPullDownRefresh() {
    my.httpRequest({
      url: app.globalData.server + '/api/v4',
      success: function(res) {
        my.stopPullDownRefresh();
      },
    })
  },
});

const app = getApp();
Page({
  data: {
    status: [],
    ecardorder_id: '',
    isback: false,
    readercardList: ''
  },
  onLoad(query) {
    this.setData({
      isback: query.isback,
    })
  },
  onShow: function() {
    // 判断是否登陆，登陆后判断是否绑定读者卡
    my.showLoading({ content: '加载中...', });
    var _this = this;
    my.httpRequest({
      url: app.globalData.server + '/api/v5/mini/myInfo',
      data: {
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: function(res) {
        my.hideLoading({});
        if (!res.data.status) {
          my.navigateTo({
            url: '../login/passwordLogin/passwordLogin',
          })
        } else {
          var _this2 = _this;
          my.httpRequest({
            url: app.globalData.server + '/api/v4/user/myReadercard',
            data: {
              openid: app.globalData.openid,
              client: 'alipay_mini'
            },
            success: function(res) {
              _this2.setData({
                readercardList: res.data.readercardList,
              })
            }
          })
        }
      }
    });
    my.httpRequest({
      url: app.globalData.server + '/api/v5/user/myEcardorder',
      data: {
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: (res) => {
        var ecardorderList = res.data.ecardorderList;
        _this.setData({
          ecardorderList: ecardorderList
        })
      },
    });
  },
  unBinding: function(e) {
    var _this = this;
    var readercard_id = e.currentTarget.dataset.readercard_id;
    my.confirm({
      title: '温馨提示',
      content: '是否要解除绑定',
      confirmButtonText: '解绑',
      cancelButtonText: '取消',
      success: function(res) {
        if (res.confirm) {
          my.httpRequest({
            url: app.globalData.server + '/api/v4/user/unBinding/' + readercard_id,
            data: {
              openid: app.globalData.openid,
              client: 'alipay_mini'
            },
            success: function(res) {
              if (res.data.status) {
                // 获取读者卡
                var _this2 = _this;
                my.httpRequest({
                  url: app.globalData.server + '/api/v4/user/myReadercard',
                  data: {
                    openid: app.globalData.openid,
                    client: 'alipay_mini'
                  },
                  success: function(res) {
                    _this2.setData({
                      readercardList: res.data.readercardList,
                    })
                  }
                })
              }
            }
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  back: function(e) {
    let pages = getCurrentPages();//当前页面
    let prevPage = pages[pages.length - 2];//上一页面
    prevPage.setData({ //直接给上移页面赋值
      cardno: e.currentTarget.dataset.cardno,
      readercard_id: e.currentTarget.dataset.readercard_id,
      orgname: e.currentTarget.dataset.orgname,
      logo: app.globalData.server + e.currentTarget.dataset.singleLogo,
    });
    if (this.data.isback) {
      my.navigateBack({
        delta: 1
      })
    }
  },
  statusSuccess: function(e) {
    my.navigateTo({
      url: '../submitSuccess/submitSuccess?ecardorder_id=' + e.currentTarget.dataset.id
    });
  },
  onShareAppMessage() {
    return {
      title: '书堆儿',
      desc: '免费借阅纸质图书，快递配送，全程免费',
      path: 'pages/index/index'
    };
  },
});

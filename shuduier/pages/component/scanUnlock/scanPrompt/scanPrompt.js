const app = getApp();
Page({
  data: {
    unlockDocList: ""
  },
  //确认解锁
  confirmUnlock: function() {
    my.navigateTo({
      url: '../unlockVertificate/unlockVertificate'
    })
  },
  onShow: function() {
    // 判断是否登陆
    var _this = this;
    my.httpRequest({
      url: app.globalData.server + '/api/v5/mini/myInfo',
      data: {
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: function(res) {
        _this.setData({
          hiddenLoading: true,
        })
        if (!res.data.status) {
          // 未登录
          my.navigateTo({
            url: '../../login/passwordLogin/passwordLogin',
          })
        } else {
          var _this2 = _this;
          //获取登陆书柜的说明文档
          my.httpRequest({
            url: app.globalData.server + '/api/v5/mini/unlockDoc',
            data: {
              openid: app.globalData.openid,
              client: 'alipay_mini'
            },
            success: function(res) {
              _this2.setData({
                unlockDocList: res.data.unlockDoc
              })
            }
          })
        }
      }
    })
  },

  onLoad() {},
  onShareAppMessage() {
    return {
      title: '书堆儿',
      desc: '免费借阅纸质图书，快递配送，全程免费',
      path: 'pages/index/index'
    };
  },
});

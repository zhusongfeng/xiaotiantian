const app = getApp();
Page({
  data: {
    texts: '',
  },
  //获取内容
  content: function(e) {
    this.setData({
      texts: e.detail.value
    })
  },
  onLoad() {},
  onShow: function() {
    var _this = this;
    // 判断是否登陆，登陆后判断是否绑定读者卡
    my.httpRequest({
      url: app.globalData.server + '/api/v5/mini/myInfo',
      data: {
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: function(res) {
        if (res.data.status) {
          
        } else {
          my.navigateTo({
            url: '../login/passwordLogin/passwordLogin',
          })
        }
      }
    })
  },
  click:function(){
    var texts = this.data.texts;
    if (!texts) {
      my.showToast({
        content: '输入内容不能为空',
        duration: 2000,
      });
    }
    my.httpRequest({
      url: app.globalData.server + '/api/user/feedback',
      data: {
        mobile: 13991754223,
        content: texts,
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: (res) => {
        if(res.data.status){
          my.navigateBack({
            delta: 1
          });
        }
      },
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

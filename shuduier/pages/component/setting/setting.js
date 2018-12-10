const app = getApp();
Page({
  data: {
    user:'登录',
    userNumber:'',
    headpic: ""
  },
  onLoad() {
    my.getAuthCode({
      scopes: 'auth_base',
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
  exitLogin:function(){
    my.confirm({
      title: '温馨提示',
      content: '您是否要退出当前登录',
      confirmButtonText: '立即退出',
      cancelButtonText: '再想想',
      success: (res) => {
        if (res.confirm){
          var _this = this;
          my.httpRequest({
            url: app.globalData.server + '/api/v5/mini/loginOut',
            data: {
              openid: app.globalData.openid,
              client: 'alipay_mini'
            },
            success: (res) => {
              if (res.data.status) {
                _this.setData({
                  user: "",
                  userNumber: '',
                })
                my.showToast({
                  content: '退出登录成功',
                  duration: 2000
                });
                my.navigateBack({
                  delta: 1
                });
              } else {
                my.showToast({
                  content: res.data.message,
                  duration: 2000
                });
              }
            },
          });
        }else{

        }
      },
    });
    
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
          })
        }
      }
    })
  },
  isLogin:function(e){
    if (this.data.user == '登录') {
      my.navigateTo({
        url: "../login/passwordLogin/passwordLogin"
      })
    }
  },
  onShareAppMessage() {
    return {
      title: '书堆儿',
      desc: '免费借阅纸质图书，快递配送，全程免费',
      path: 'pages/index/index'
    };
  },
});

const app = getApp();
Page({
  data: {
    addressList: '',
    address_id: '',
    isback: false,
  },
  onLoad(query) {
    this.setData({
      address_id: query.address_id,
      isback: query.isback,
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
        if (!res.data.status) {
          // 未登录
          my.redirectTo({
            url: '../login/passwordLogin/passwordLogin',
          })
        } else {
          var _this2 = _this;
          // 获取地址
          my.httpRequest({
            url: app.globalData.server + '/api/user/myAddress',
            data: {
              openid: app.globalData.openid,
              client: 'alipay_mini'
            },
            success: function(res) {
              var addressList = res.data.addressList;
              _this2.setData({
                addressList: addressList,
              })
            }
          })
        }
      }
    })
  },
  receivedAddress:function(){
    my.navigateTo({
      url:'../deitAddress/deitAddress'
    });
  },
  back: function(e) {
    let pages = getCurrentPages();//当前页面
    let prevPage = pages[pages.length - 2];//上一页面
    prevPage.setData({ //直接给上移页面赋值
      address_name: e.currentTarget.dataset.name,
      address_mobile: e.currentTarget.dataset.mobile,
      address_addressStr: e.currentTarget.dataset.addressstr,
      address_id: e.currentTarget.dataset.address_id,
    });
    if (this.data.isback) {
      my.navigateBack({
        delta: 1
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

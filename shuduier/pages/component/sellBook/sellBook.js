const app = getApp();
Page({
  data: {
    user_id:'',
  },
  onShow(){
    var _this=this;
    my.showLoading({
      content:'加载中...'
    });
    my.httpRequest({
      url: app.globalData.sgr_server + '/api/sell/mySellList',
      data: {
        user_id: app.globalData.openid,
        client: 'alipay_mini',
      },
      success: (res) => {
        my.hideLoading({});
        var list = res.data.sellPage.list;
        for (var index in list) {
          var bookList = list[index].bookList;
        }
        _this.setData({
          list: list,
          bookList: bookList,
        })
      },
    });
  },
  onPullDownRefresh() {
    my.httpRequest({
      url: app.globalData.sgr_server + '/api/sell/mySellList',
      data: {
        user_id: app.globalData.openid,
        client: 'alipay_mini',
      },
      success: (res) => {
        my.hideLoading({});
        var list = res.data.sellPage.list;
        for (var index in list) {
          var bookList = list[index].bookList;
        }
        _this.setData({
          list: list,
          bookList: bookList,
        })
      },
    });
    my.stopPullDownRefresh()
  },
  onShareAppMessage() {
    return {
      title: '书堆儿',
      desc: '免费借阅纸质图书，快递配送，全程免费',
      path: 'pages/index/index'
    };
  },
});

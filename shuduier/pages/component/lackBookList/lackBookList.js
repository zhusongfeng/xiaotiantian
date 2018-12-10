const app = getApp();
Page({
  data: {
  },
  onLoad() {
    my.showLoading({ content: '加载中...', });
  },
  onShow(){
    my.httpRequest({
      url: app.globalData.server + '/api/user/checkinList',
      data: {
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: (res) => {
        my.hideLoading({});
        var checkinList = res.data.checkinList;
        for (var index in checkinList) {
          var status=checkinList[index].status;
          if (status==1){
            var coverimg = checkinList[index].coverimg;
            if (coverimg.indexOf("//img") == -1 && coverimg.indexOf("http") == -1) {
              checkinList[index].coverimg = app.globalData.server + coverimg;
            }
          }
        }
        this.setData({
          checkinList: checkinList,
        })
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
  onPullDownRefresh() {
    my.httpRequest({
      url: app.globalData.server + '/api/user/checkinList',
      data: {
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: (res) => {
        var checkinList = res.data.checkinList;
        this.setData({
          checkinList: checkinList,
        })
        my.stopPullDownRefresh()
      },
    });
  }
});

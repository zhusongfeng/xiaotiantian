const app = getApp();
Page({
  data: {
    server: app.globalData.server,
    subjectList:'',
  },
  onLoad(e) {
    var _this = this;
    my.httpRequest({
      url: app.globalData.server + '/api/v4/subject/list',
      data: {
        code__equal: 'normal',
        is_show__equal: 1
      },
      success: (res) => {
        var subjectList = res.data.subjectList;
        for (var index in subjectList) {
          var coverimg = (subjectList[index].coverimg).split("&&")[0];
          if (coverimg.indexOf("//img") == -1 && coverimg.indexOf("http") == -1) {
            subjectList[index].coverimg = app.globalData.server + coverimg;
          }
        }
        _this.setData({
          subjectList: subjectList,
          hiddenLoading: true,
        })
      },
      fail: (res) => {}
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

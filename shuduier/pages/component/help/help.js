const app = getApp();
Page({
  data: {
    content:''
  },
  onLoad(query) {
    var _this = this;
    var url=query.url;
    my.httpRequest({
      url: app.globalData.server + "/api"+url, // 目标服务器url  
      success: (res) => {
        var article = res.data.article;
        var content = res.data.article.content;
        _this.setData({
          article: article,
          content:content
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
});

const app = getApp();
Page({
  data: {
    server: app.globalData.server,
    hiddenLoading: false,
    // 首页专题
    newbooks: '',
    borrowno: '',
    bookList:''
  },
  onLoad(query) {
    var _query = query;
    var _this = this;
    this.setData({
      borrowno: query.borrowno,
    })
    my.httpRequest({
      url: app.globalData.server + '/api/v5/user/recommendBook',
      data:{
        limit:6,
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: (res) => {
        var bookList = res.data.bookList;
        for (var index in bookList) {
          var coverimg = (bookList[index].coverimg).split("&&")[0];
          if (coverimg.indexOf("//img") == -1 && coverimg.indexOf("http") == -1) {
            bookList[index].coverimg = app.globalData.server + coverimg;
          }
        }
        _this.setData({
          bookList: bookList,
          hiddenLoading: true,
        })
      }
    })
  },
  // 图书封面显示错误时用默认封面代替
  errorCoverimg: function(e) {
    if (e.type == "error") {
      var errorImgIndex = e.target.dataset.errorimg //获取错误图片循环的下标
      var bookList = this.data.bookList;
      var imgList = this.data.bookList; 　
      imgList[errorImgIndex].coverimg = "../../image/lackBook.png"; 
      this.setData({
        bookList: bookList,
      })
    }
  },
  returnBack:function(){
    my.navigateBack({
      delta: 2
    });
  },
  searchOrder:function(){
    my.switchTab({
      url: '../borrow/borrow',
      success: (res) => {
        
      },
    });
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
  },
  onShareAppMessage() {
    return {
      title: '书堆儿',
      desc: '免费借阅纸质图书，快递配送，全程免费态',
      path: 'pages/index/index'
    };
  },
});

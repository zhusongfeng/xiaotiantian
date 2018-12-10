const app = getApp();
Page({
  data: {
    
  },
  onLoad(query) {
    my.showLoading({ content: '加载中...', });
    var _this = this;
    var subject_id = query.subject_id;
    _this.setData({
      subject_id: subject_id
    })
    my.httpRequest({
      url: app.globalData.server + '/api/book/subjectBookList/' + subject_id,
      data: {
        openid: app.globalData.openid,
        client: 'alipay_mini',
        page:1,
        rows:50,
      },
      success: function(res) {
        my.hideLoading({});
        var newbooks = res.data;
        for (var index in newbooks.bookList) {
          var coverimg = newbooks.bookList[index].coverimg;
          if (coverimg != null) {
            if (coverimg.indexOf("//img") == -1 && coverimg.indexOf("http") == -1) {
              newbooks.bookList[index].coverimg = app.globalData.server + coverimg;
            }
          } else {
            newbooks.bookList[index].coverimg = "../../../image/lackBook.png";
          }
        }
        _this.setData({
          newbooks: newbooks,
          hiddenLoading: true,
        })
      }
    })
  },
  // 图书封面显示错误时用默认封面代替
  errorCoverimg: function(e) {
    if (e.type == "error") {
      var errorImgIndex = e.target.dataset.errorimg //获取错误图片循环的下标
      var newbooks = this.data.newbooks;
      var imgList = this.data.newbooks.bookList; 　  //将图片列表数据绑定到变量
      imgList[errorImgIndex].coverimg = "../../../image/lackBook.png"; //错误图片替换为默认图片
      this.setData({
        newbooks: newbooks,
      })
    }
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    my.httpRequest({
      url: app.globalData.server + '/api/book/subjectBookList/' + this.data.subject_id,
      data: {
        openid: app.globalData.openid,
        client: 'alipay_mini',
        page: 1,
        rows: 50,
      },
      success: function(res) {
        my.stopPullDownRefresh()
      }
    })
    
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    return {
      title: '书堆儿',
      desc: '免费借阅纸质图书，快递配送，全程免费',
      path: 'pages/index/index'
    };
  },
});

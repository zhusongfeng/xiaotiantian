const app = getApp();
Page({
  data: {
    
  },
  onLoad(query) {
    my.showLoading({ content: '加载中...', });
    var searchWord=query.key;
    var _this = this;
    this.setData({
      searchWord: searchWord
    })
    my.httpRequest({
      url: app.globalData.server + '/api/book/search/',
      data:{
        key: searchWord,
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: (res) => {
        my.hideLoading({});
        var newbooks = res.data;
        if (newbooks.bookList == null || newbooks.bookList == '') {
          my.confirm({
            title: '温馨提示',
            content: '平台暂无此书,您是否要进行缺书登记',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            success: (res) => { 
              if(res.confirm){
                my.redirectTo({
                  url: '../lackBooks/lackBooks?searchWord=' + searchWord, // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
                });
              }else{
                my.navigateBack({
                  delta: 1
                });
              }
            },
          });
        }
        for (var index in newbooks.bookList){
          var coverimg = newbooks.bookList[index].coverimg;
          if (coverimg != null) {
            if (coverimg.indexOf("//img") == -1 && coverimg.indexOf("http") == -1) {
              newbooks.bookList[index].coverimg = app.globalData.server + coverimg;
            }
          } 
        }
        _this.setData({
          newbooks: newbooks,
        })
      },
    });
  },
  errorCoverimg: function(e) {
    if (e.type == "error") {
      var errorImgIndex = e.target.dataset.errorimg;
      var newbooks = this.data.newbooks;
      var imgList = this.data.newbooks.bookList; 　  
      imgList[errorImgIndex].coverimg = "../../../image/lackBook.png"; 
      this.setData({
        newbooks: newbooks,
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

const app = getApp();
Page({
  data: {
    tab: 0,
    activeTab:0,
    book_id: '',
    title: '',
    author: '',
    price: '',
    content: '暂无内容',
    isbn: '',
    publisher: '',
    coverimg: '../../../image/lackBook.png',
    id:'',
    btnText:'',
    isExistBookshelf:''
  },
  tab_slide: function(e) {//滑动切换tab 
    var that = this;
    that.setData({ tab: e.detail.current });
  },
  tab_click: function(e) {//点击tab切换
    var that = this;
    if (that.data.tab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        tab: e.target.dataset.current
      })
    }
  },
   handleTabClick({ index }) {
    this.setData({
      activeTab: index,
    });
  },
  handleTabChange({ index }) {
    this.setData({
      activeTab: index,
    });
  },
  handlePlusClick() {
    my.alert({
      content: 'plus clicked',
    });
  },
  onLoad(query) {
    my.showLoading({ content: '加载中...', });
    var book_id = query.book_id;
    this.setData({
      book_id: book_id
    })
    var _this = this;
    my.httpRequest({
      url: app.globalData.server + '/api/book/' + book_id,
      data: {
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: (res) => {
        my.hideLoading({});
        var book = res.data.book;
        var isExistBookshelf = res.data.book.isExistBookshelf;
        if (isExistBookshelf==false){
          var btnText ='加入书架';
          _this.setData({
            btnText: btnText
          })
        }else{
          var btnText = '已加入书架';
          _this.setData({
            btnText: btnText
          })
        }
        _this.setData({
          title: book.title,
          author: book.author,
          price: book.price,
          isbn: book.isbn,
          publisher: book.publisher,
          coverimg: book.coverimg,
          id: book.id,
          // isExistBookshelf: book.isExistBookshelf
        })
        if (book.bookExt.contentintro) {
          _this.setData({
            content: book.bookExt.contentintro,
          })
        }
      },
    });
  },
  errorCoverimg: function(e) {
    if (e.type == "error") {
      this.setData({
        coverimg: '../../../image/lackBook.png',
      })
    }
  },
  borrowDetail:function(){
    my.httpRequest({
      url: app.globalData.server + '/api/v5/mini/myInfo',
      data: {
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: (res) => {
        if (!res.data.status){
          my.navigateTo({
            url: '../login/passwordLogin/passwordLogin'
          });
        }else{
          my.httpRequest({
            url: app.globalData.server + '/api/user/isBinding',
            data: {
              openid: app.globalData.openid,
              client: 'alipay_mini'
            },
            success: (res) => {
              if (!res.data.status){
                my.alert({
                  title: '温馨提示',
                  content: '您还未绑卡，请先绑定您的读者卡', 
                  buttonText: '立即绑卡',
                  success: (res) =>{
                    my.navigateTo({
                      url: '../tieCard/tieCard'
                    })
                  }
                });
              }else{
                my.redirectTo({
                  url: '../confirmation/confirmation?book_id=' + this.data.book_id
                });
              }
            },
          });
        }
      },
    });
  },
  // 图书封面显示错误时用默认封面代替
  errorCoverimg: function(e) {
    if (e.type == "error") {
      this.setData({
        coverimg: '../../../image/lackBook.png',
      })
    }
  },
bookShare:function(query){
  var book_id = query.currentTarget.dataset.id;
  this.setData({
    book_id: book_id,
  })
  my.httpRequest({
    url: app.globalData.server + '/api/v5/mini/myInfo',
    data: {
      openid: app.globalData.openid,
      client: 'alipay_mini'
    },
    success: (res) => {
      if (!res.data.status){
        my.navigateTo({
          url: '../login/passwordLogin/passwordLogin',
        })
      }else{
        my.httpRequest({
          url: app.globalData.server + '/api/book/' + book_id,
          data: {
            openid: app.globalData.openid,
            client: 'alipay_mini'
          },
          success: (res) => {
            var book = res.data.book;
            var flag = book.isExistBookshelf;
            if (!flag) {
              my.httpRequest({
                url: app.globalData.server + '/api/user/addBookshelf/' + book_id,
                data: {
                  openid: app.globalData.openid,
                  client: 'alipay_mini'
                },
                success: (res) => {
                  if (res.data.status) {
                    this.setData({
                      btnText: '已加入书架',
                      flag: false
                    })
                  }
                },
              });
            } else {
              my.httpRequest({
                url: app.globalData.server + '/api/user/myBookshelf',
                data: {
                  openid: app.globalData.openid,
                  client: 'alipay_mini'
                },
                success: (res) => {
                  var bookList = res.data.bookList;
                  var bs_id = bookList[0].bs_id;
                  my.httpRequest({
                    url: app.globalData.server + '/api/user/deleteBookshelf/' + bs_id,
                    data: {
                      openid: app.globalData.openid,
                      client: 'alipay_mini'
                    },
                    success: (res) => {
                      if (res.data.status) {
                        this.setData({
                          btnText: '加入书架',
                          flag: true
                        })
                      }
                    },
                  });
                },
              })
            }
          }
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

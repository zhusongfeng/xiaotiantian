const app = getApp();
Page({
  data: {
    book_id: '',
    title: '',
    author: '',
    price: '',
    isbn: '',
    coverimg: '../../../image/lackBook.png',
    address: '',
    address_id: '',
    logo: '',
    address_name: '',
    address_mobile: '',
    address_addressStr: '',
    onlinemaxborrow: '',
    maxborrow: '',
    orgname: '',
    cardno: '',
    readercard_id: '',
    remark: '',
  },
  onLoad(query) {
    this.setData({
      book_id: query.book_id,
    })
    var _this = this;
    my.httpRequest({
      url: app.globalData.server + '/api/v5/mini/borrowDetail/' + this.data.book_id,
      data: {
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: (res) => {
        var coverimg = res.data.book.coverimg;
        var logo = app.globalData.server + (res.data.org.logo).split("&&")[2];
        if (coverimg.indexOf("//img") == -1 && coverimg.indexOf("http") == -1) {
          coverimg = app.globalData.server + coverimg;
        }
        _this.setData({
          title: res.data.book.title,
          author: res.data.book.author,
          price: res.data.book.price,
          isbn: res.data.book.isbn,
          coverimg: coverimg,
          address: res.data.address,
          logo: logo,
          returnAddress: res.data.returnAddress,
          onlinemaxborrow: res.data.onlinemaxborrow,
          maxborrow: res.data.maxborrow,
          borrowperiod: res.data.borrowperiod,
          renewperiod: res.data.renewperiod,
          orgname: res.data.org.name,
          cardno: res.data.readercard.cardno,
          readercard_id: res.data.readercard.id,
        })
        if (res.data.address) {
          _this.setData({
            address_id: res.data.address.id,
            address_name: res.data.address.name,
            address_mobile: res.data.address.mobile,
            address_addressStr: res.data.address.addressStr,
          })
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
  onShow: function() {
    var _this = this;
    my.httpRequest({
      url: app.globalData.server + '/api/v4/borrow/borrowRule',
      data: {
        readercard_id: this.data.readercard_id,
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: function(res) {
        _this.setData({
          returnAddress: res.data.returnAddress,
          onlinemaxborrow: res.data.onlinemaxborrow,
          maxborrow: res.data.maxborrow,
          borrowperiod: res.data.borrowperiod,
          renewperiod: res.data.renewperiod,
        })
      }
    })
  },
  remarkInput: function(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  submit: function() {
    if (!this.data.address_mobile) {
      my.showToast({ content: '请先添加收货地址', duration: 2000 })
      return;
    }
    my.showLoading({ content: '加载中...', });
    my.httpRequest({
      url: app.globalData.server + '/api/v4/borrow/borrowBook',
      data: {
        readercard_id: this.data.readercard_id,
        book_id: this.data.book_id,
        address_id: this.data.address_id,
        openid: app.globalData.openid,
        leaveMsg: this.data.remark,
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: function(res) {
        my.hideLoading({});
        if (res.data.status) {
          my.redirectTo({
            url: '../borrowSuccess/borrowSuccess?borrowno=' + res.data.borrowno,
          })
        } else {
          my.showToast({ content: res.data.message, duration: 5000 })
          return;
        }
      }
    })
  },
  click: function() {
    my.navigateTo({
      url: '../bookDetails/bookDetails?book_id=' + this.data.book_id
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

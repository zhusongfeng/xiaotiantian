const app = getApp();
Page({
  data: {
    itemList: {
      hidden: false
    },
    bookName:'',
    cardIsbn:'',
    author:'',
    publish:'',
    otherMsg:''
  },
  bookInput:function(e){
    this.setData({
      bookName: e.detail.value
    })
  },
  cardnoInput:function(e){
    this.setData({
      cardIsbn: e.detail.value
    })
  },
  account_val: function(e) {
    this.setData({
      cardIsbn: e.detail.value.replace(/\s+/g, "")
    })
  },
  authorInput: function(e) {
    this.setData({
      author: e.detail.value
    })
  },
  publishInput: function(e) {
    this.setData({
      publish: e.detail.value
    })
  },
  otherInput: function(e) {
    this.setData({
      otherMsg: e.detail.value
    })
  },

  click: function(query) {
    var that = this;
    var index = query.currentTarget.dataset.index;
    var now = "itemList[" + index + "].hidden";
    if (that.data.itemList[index].hidden == false) {
      that.setData({
        [now]: true,
      })
    } else {
      that.setData({
        [now]: false,
      })
    }
  },
  onLoad(query) {
    var searchWord = query.searchWord;
    var r = /^\+?[1-9][0-9]*$/
    if (r.test(searchWord)){
      var cardIsbn = searchWord;
    }else{
      var bookName = searchWord;
    }
    this.setData({
      cardIsbn: cardIsbn,
      bookName: bookName
    })
  },
  onShow() {
    var _this = this;
    my.httpRequest({
      url: app.globalData.server + '/api/v5/mini/myInfo',
      data: {
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: (res) => {
        if (!res.data.status){
          my.redirectTo({
            url: '../login/passwordLogin/passwordLogin',
          })
        }
      },
    });
  },
  lackBook:function(){
    var bookName = this.data.bookName;
    var cardIsbn = this.data.cardIsbn;
    var author = this.data.author;
    var publish = this.data.publish;
    var otherMsg = this.data.otherMsg;
    if(bookName==''||bookName==null){
      my.showToast({content:'输入的书名不能为空', duration: 2000});
      return;
    }
    if (cardIsbn == '' || cardIsbn == null || !this.isIsbn(cardIsbn)) {
      my.showToast({ content: '输入的ISBN不能为空', duration: 2000 });
      return;
    }
    my.httpRequest({
      url: app.globalData.server + '/api/user/checkin',
      data:{
        openid: app.globalData.openid,
        client: 'alipay_mini',
        title: bookName,
        isbn: cardIsbn
      },
      success: (res) => {
        if (res.data.errorKey =="existIsbn"){
          my.showToast({content:res.data.message,duration:2000 });
          return;
        } else if (res.data.errorKey == "errorIsbn"){
          my.showToast({ content: '您输入的ISBN不正确', duration: 2000 });
          return;
        }else if(res.data.status){
          my.showToast({ content: res.data.message, duration: 2000 });
          my.redirectTo({
            url:'../lackBookList/lackBookList'
          });
        } else if (res.data.errorKey == "alreadyCheckin"){
          my.showToast({ content: res.data.message, duration: 2000 });
        }
      },
    });
  },
  isIsbn: function(isbn){
    var frontStr = isbn.substring(0, isbn.length - 1);
    var backStr = isbn.substring(isbn.length - 1);
    if (frontStr.length === 9) {
      var sum = 0;
      for (var i = 0; i < frontStr.length; i++) {
        sum += frontStr[i] * (10 - i);
      }
      var last = 11 - sum % 11;
      if (last === 10) {
        last = 'x';
      } else if (last === 11) {
        last = 0;
      }
      if (last == backStr) {
        return true;
      }
    } else if (frontStr.length === 12) {
      var sum = 0;
      for (var i = 0; i < frontStr.length; i++) {
        if (i % 2 === 0) {
          sum += frontStr[i] * 1;
        } else {
          sum += frontStr[i] * 3;
        }
      }
      var last = 10 - sum % 10;
      if (last === 10) {
        last = 0;
      }
      if (last == backStr) {
        return true;
      }
    }
    return false;
  },
  onShareAppMessage() {
    return {
      title: '书堆儿',
      desc: '免费借阅纸质图书，快递配送，全程免费',
      path: 'pages/index/index'
    };
  },
});

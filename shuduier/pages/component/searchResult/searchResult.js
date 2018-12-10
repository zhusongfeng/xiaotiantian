const app = getApp();
Page({
  data: {
    searchWordArray: [],
    searchWord: ''
  },
  onLoad: function(query) {
    var _this = this;
    my.getStorage({
      key: 'keyWord',
      success: function(res) {
        var historykey = res.data;
        _this.setData({
          searchWordArray: historykey,
          hiddenLoading: true,
        })
      }
    })
    _this.searchHot();
  },
  searchHot: function() {
    var _this = this;
    my.httpRequest({
      url: app.globalData.server + '/api/book/searchHotKey',
      data: {
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: function(res) {
        var hotkey = res.data;
        _this.setData({
          hotkey: hotkey,
          hiddenLoading: true,
        })
      }
    })
  },
  searchAnther: function() {
    var _this = this;
    _this.searchHot();
  },
  searchInput: function(e) {
    this.setData({
      searchWord: e.detail.value
    })
  },
  searchBook: function() {
    var searchWord = this.data.searchWord;
    if (!searchWord) {
      my.showToast({ content: '您未输入搜索内容', duration: 2000 })
      return;
    }
    this.addHistoryWord(searchWord);
    my.navigateTo({
      url: "../searchWin/searchWin?key=" + searchWord,
    })
  },
  searchItem: function(e){
    var searchWord = e.currentTarget.dataset.key;
    this.setData({
      searchWord: searchWord
    })
    this.searchBook();
  },
  addHistoryWord: function(searchWord){
    var searchWordArray = this.data.searchWordArray;
    if(searchWordArray == null || searchWordArray.length == 0){
      searchWordArray = [];
    }else{
      for (var index in searchWordArray){
        if (searchWord == searchWordArray[index]){
          return;
        }
        if(index == 10){
          searchWordArray.pop();
        }
      }
    }
    searchWordArray.unshift(searchWord);
    my.setStorage({
      key: 'keyWord',
      data: searchWordArray,
    })
    this.setData({
      searchWordArray: searchWordArray,
    })
  },
  clearHistory: function() {
    my.removeStorage({
      key: 'keyWord',
    })
    this.setData({
      searchWordArray: [],
    })
    my.showToast({ content: '清除完成', duration: 2000 })
  }
});

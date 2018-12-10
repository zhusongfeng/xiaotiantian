const app = getApp();
var num4 = 0; var num5 = 0; 
Page({
  data: {
    open: false,
    // color4:  'rgb(230,75,18)',
    color5: ' rgb(153,153,153)',
    borrowList:'',
    statusStr:'',
    isShowLogin: false,
    tab: 0,
    status: ''
  },
  showitem: function() {
    this.setData({
      open: !this.data.open
    })
  },
  //页面打开加载数据
  onShow: function() {
    var _this = this;
    // _this.openPage(this.data.status);
    my.httpRequest({
      url: app.globalData.server + '/api/v5/mini/myInfo',
      data: {
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: (res) => {
          my.hideLoading({});
          _this.setData({
            isShowLogin: !res.data.status
          });
          if (res.data.status) {
            _this.openPage(this.data.status);
          }
        }
    });
  },
  loginIn: function(){
    my.navigateTo({
      url: '../login/passwordLogin/passwordLogin',
    })
  },
  onLoad:function(){
    
  },
  openPage: function(status) {
    my.showLoading({ content: '加载中...', });
    my.httpRequest({
      url: app.globalData.server + '/api/borrow/borrowList',
      data: {
        status: status,
        openid: app.globalData.openid,
        client: 'alipay_mini',
        page:1,
        rows:100
      },
      success: (res) => {
        my.hideLoading({});
        var borrowList = res.data.borrowList;
        for (var index in borrowList) {
          var coverimg = borrowList[index].coverimg;
          if (coverimg.indexOf("//img") == -1 && coverimg.indexOf("http") == -1) {
            borrowList[index].coverimg = app.globalData.server + coverimg;
          }
        }
        this.setData({
          borrowList: borrowList,
        })
      },
    });
  },
  cancels:function(query){
    var _this = this;
    var id = query.currentTarget.dataset.id;
    my.confirm({
      title:'温馨提示',
      content:'数据删除后不会回复，请慎重考虑',
      confirmButtonText: '立即删除',
      cancelButtonText: '暂不需要',
      success: (res) => {
        var _this1=_this;
        if(res.confirm){
          my.httpRequest({
            url: app.globalData.server + '/api/v5/user/deleteBorrow/' + id,
            data: {
              openid: app.globalData.openid,
              client: 'alipay_mini'
            },
            success: (res) => {
              if(res.data.status){
                _this1.openPage(this.data.status);
              }
            },
          });
        }
      },
    });
  },
  //取消订单
  canaelOrder:function(query){
    var _this = this;
    var id = query.currentTarget.dataset.id;
    my.confirm({
      title: '温馨提示',
      content: '您是否确认取消该订单',
      confirmButtonText: '立即取消',
      cancelButtonText: '暂不取消',
      success: (res) => {
        if (res.confirm) {
          my.httpRequest({
            url: app.globalData.server + '/api/borrow/cancelBorrowBook',
            data: {
              openid: app.globalData.openid,
              client: 'alipay_mini',
              borrow_id:id,
              org_id: app.globalData.openid,
            },
            success: (res) => {
              if(res.data.status){
                _this.openPage(this.data.status);
              }
            },
          });
        }
      },
    });
  },
  
  //确认收货
  collectionGoods:function(query){
    var _this = this;
    var id = query.currentTarget.dataset.id;
    my.httpRequest({
      url: app.globalData.server + '/api/borrow/confirmSignup',
      data: {
        borrow_id:id,
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: (res) => {
        if (res.data.status) {
          my.showToast({
            content: res.data.message,
          });
          _this.openPage(this.data.status);
        }
      },
    });
  },
  //确认归还
  returnBook:function(query){
    var _this = this;
    var id = query.currentTarget.dataset.id;
    my.showLoading({ content: '加载中...', });
    my.httpRequest({
      url: app.globalData.server + '/api/borrow/returnBorrow/' + id,
      data: {
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: (res) => {
        my.hideLoading({});
        if (res.data.status) {
          my.alert({
            content: res.data.message,
            success: () => {
              my.navigateTo({
                url: '../../tradeSuccess/tradeSuccess'
              });
            }
          });
          _this.openPage(this.data.status);
        } else {
          my.alert({
            content: res.data.message+',请归还至图书馆后再点击该按钮',
          });
        }
      },
    });
  },
  //续借图书
  borrowBook:function(query){
    var _this = this;
    var id = query.currentTarget.dataset.id;
    my.showLoading({ content: '加载中...', });
    my.httpRequest({
      url: app.globalData.server + '/api/borrow/renewBorrow/' + id,
      data: {
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: (res) => {
        my.hideLoading({});
        if (res.data.status) {
          my.alert({
            content: res.data.message,
          });
          _this.openPage(this.data.status);
        } else {
          my.alert({
            content: res.data.message,
          });
        }
      },
    });
  },
  switchTab:function(e){
   
  },
  // changeColor4: function() {
  //   num4++;
  //   var result = num4 / 2;
  //   if (num4 % 2 == 0) {
  //     this.setData({
  //       color4: 'rgb(153,153,153)',
  //       color5: 'rgb(230,75,18)'
  //     })
  //   } else {
  //     this.setData({
  //       color4: 'rgb(230,75,18)',
  //       color5 :'rgb(153,153,153)',
  //       open: !this.data.open
  //     })
  //   }
  //   this.openPage(this.data.status);
  // },
  changeColor5: function() {
    num5++;
    var result = num5 / 2;
    if (num5 % 2 == 0) {
      this.setData({
        color5: 'rgb(153,153,153)',
        // color4: 'rgb(230,75,18)',
      })
    } else {
      this.setData({
        color5: 'rgb(230,75,18)',
        // color4: 'rgb(153,153,153)',
        open: !this.data.open
      })
    }
    my.navigateTo({
      url:'../allOrder/return/return',
    });
  },
  // tab_slide: function(e) {//滑动切换tab 
  //   this.setData({ tab: e.detail.current });
  // },
  tab_click: function(e) {
    this.setData({
      tab: e.target.dataset.current,
      status: e.target.dataset.status,
      open: false
    })
    this.openPage(e.target.dataset.status);
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
      url: app.globalData.server + '/api/borrow/borrowList',
      data: {
        status: status,
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: function(res) {
        my.stopPullDownRefresh();
      },
    })
  },
})

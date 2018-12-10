const app = getApp();
Page({
  data: {
    orgName:'',
    title:'',
    coverimg:'',
    author:'',
    isbn:'',
    borrowno:'',
    gmt_create:'',
    orgLinklist:'',
    orgAddress:'',
    inforMsg:'',
    status:'',
    id:'',
    text:'',
    copy: '',
    expressorder_id:'',
    book_id:'',
    borror_id:''
  },
  onLoad(query) {
    var _this = this;
    var borror_id = query.borror_id;
    _this.setData({
      borror_id: borror_id
    })
  },
  onShow() {
    this.openPage();
  },
  openPage:function(){
    var borror_id=this.data.borror_id;
    var _this=this;
    my.httpRequest({
      url: app.globalData.server + '/api/borrow/' + borror_id,
      data: {
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: (res) => {
        var borrow = res.data.borrow;
        if (borrow.gmt_back!=null){
          var gmt_back = (borrow.gmt_back).split(' ')[0];
        }
        for (var index in borrow) {
          var coverimg = borrow.book.coverimg;
          if (coverimg != null) {
            if (coverimg.indexOf("//img") == -1 && coverimg.indexOf("http") == -1) {
              borrow.book.coverimg = app.globalData.server + coverimg;
            }
          } else {
            borrow.book.coverimg = "../../../image/lackBook.png";
          }
        }
        var statusStr = borrow.statusStr;
        if (statusStr == "已取消") {
          statusStr = "您提交的借阅已经取消!";
        } else if (statusStr == "待审核") {
          statusStr = "您提交的借阅正在审核中，请稍后!";
        } else if (statusStr == "采购中") {
          statusStr = "您借阅的图书正在采购中，一般需要1-2天，如遇缺货时间将延长，请耐心等候!";
        } else if (statusStr == "待收货") {
          statusStr = "您借阅的图书正在快马加鞭飞奔向您!";
        } else if (statusStr == "待归还") {
          statusStr = "请于" + gmt_back + "前将图书归还至" + borrow.orgLinklist;
        } else if (statusStr == "已归还") {
          statusStr = "您本次借阅已完成，欢迎继续借阅!";
        } else if (statusStr == "编目中") {
          statusStr = "您借阅的图书我们工作人员正在编目加工中，请稍后!";
        } else if (statusStr == "待发货") {
          statusStr = "您借阅的图书快递公司正在揽件，请稍后!";
        }
        _this.setData({
          orgName: borrow.orgName,
          title: borrow.book.title,
          coverimg: coverimg,
          author: borrow.book.author,
          isbn: borrow.book.isbn,
          borrowno: borrow.borrowno,
          gmt_create: borrow.gmt_create,
          orgLinklist: borrow.orgLinklist,
          orgAddress: borrow.orgAddress,
          inforMsg: statusStr,
          status: borrow.status,
          id: borrow.id,
          text: borrow.borrowno,
          expressorder_id: borrow.expressorder_id,
          book_id: borrow.book_id
        })
      },
    });
  },
  cancels: function(query) {
    var _this = this;
    var id = query.currentTarget.dataset.id;
    my.confirm({
      title: '温馨提示',
      content: '数据删除后不会回复，请慎重考虑',
      confirmButtonText: '立即删除',
      cancelButtonText: '暂不需要',
      success: (res) => {
        if (res.confirm) {
          my.httpRequest({
            url: app.globalData.server + '/api/v5/user/deleteBorrow/' + id,
            data: {
              openid: app.globalData.openid,
              client: 'alipay_mini'
            },
            success: (res) => {
              if (res.data.status) {
                my.navigateBack({
                  delta: 1
                });
              }
            },
          });
        }
      },
    });
  },
  //取消订单
  canaelOrder: function(query) {
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
              borrow_id: id,
              org_id: app.globalData.openid,
            },
            success: (res) => {
              if (res.data.status) {
                my.navigateBack({
                  delta: 1
                });
              }
            },
          });
        }
      },
    });
  },
  //查看物流
  logistic: function() {
    var expressorder_id = this.data.expressorder_id;
    my.navigateTo({
      url: '../../logistics/logistics?expressorder_id=' + expressorder_id
    });
  },
  //确认收货
  collectionGoods: function(query) {
    var _this = this;
    var id = query.currentTarget.dataset.id;
    my.httpRequest({
      url: app.globalData.server + '/api/borrow/confirmSignup',
      data: {
        borrow_id: id,
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: (res) => {
        if (res.data.status) {
          my.showToast({
            content: res.data.message,
            duration: 2000
          });
          my.navigateBack({
            delta: 1
          });
        }
      },
    });
  },
  //确认归还
  returnBook: function(query) {
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
              _this.openPage();
              my.navigateTo({
                url: '../../tradeSuccess/tradeSuccess'
              });
            }
          });
        }else{
          my.alert({
            content: res.data.message + ',请归还至图书馆后再点击该按钮',
          });
        }
      },
    });
  },
  //续借图书
  borrowBook: function(query) {
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
            title:'温馨提示',
            content: res.data.message, 
            success: () =>{
              _this.openPage();
            }  
          });
        } else{
          my.alert({
            title: '温馨提示',
            content: res.data.message,
          });
        }
      },
    });
  },
  copy:function(){
    my.setClipboard({
      text:this.data.text,
      success: (res) => {
        my.showToast({
          content:'复制成功',duration:2000
        })
      },
    });
  },
  makePhoneCall() {
    my.makePhoneCall({ number: '4001280528' });
  },
  click: function() {
    my.navigateTo({
      url: '../../bookDetails/bookDetails?book_id=' + this.data.book_id, 
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

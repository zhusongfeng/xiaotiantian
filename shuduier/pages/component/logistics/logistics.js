const app = getApp();
Page({
  data: {
    expressorder_id:'',
    book_title:'',
    express_name:'',
    expressno:'',
    gmt_create:'',
    address:''
  },
  onLoad(query){
    var expressorder_id = query.expressorder_id;
    var _this=this;
    _this.setData({
      expressorder_id: expressorder_id
    })
    my.httpRequest({
      url: app.globalData.server + '/api/user/expressTrace/' + expressorder_id,
      data: {
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: (res) => {
        var expressorder = res.data.expressorder;
        _this.setData({
          book_title: expressorder.book_title,
          express_name: expressorder.express_name,
          expressno: expressorder.expressno,
          gmt_create: expressorder.gmt_create,
          address: expressorder.address
        })
      },
    });
  },
  copy:function(){
    my.setClipboard({
      text: this.data.expressno,
      success: (res) => {
        my.showToast({
          content: '复制成功', duration: 2000
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
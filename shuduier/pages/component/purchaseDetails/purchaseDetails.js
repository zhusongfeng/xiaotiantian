const app = getApp();
Page({
  data: {
    statusStr:'',
    status: '',
    device_name:'',
    doorno:'',
    book_count:'',
    money:'',
    sellno:'',
    gmt_create:'',
    gmt_update:''
  },
  onLoad(e) {
    var sell_id = e.sell_id;
    var _this=this;
    my.httpRequest({
      url: app.globalData.sgr_server + '/api/sell/mySellBookDetail',
      data: {
        client: 'alipay_mini',
        user_id: app.globalData.openid,
        sell_id: sell_id
      },
      success: (res) => {
        my.hideLoading({});
        var sell = res.data.sell;
        var statusStr = sell.statusStr;
        var status = sell.status;
        var device_name = sell.device_name;
        var doorno = sell.doorno;
        var book_count=sell.book_count;
        var money=sell.money;
        var sellno=sell.sellno;
        var gmt_create = sell.gmt_create;
        var gmt_update = sell.gmt_update;
        var bookList = sell.bookList;
        _this.setData({
          statusStr: statusStr,
          status: status,
          device_name: device_name,
          doorno: doorno,
          book_count: book_count,
          money: money,
          sellno: sellno,
          gmt_create: gmt_create,
          gmt_update: gmt_update,
          bookList: bookList,
        })
      },
    });
  },
  service:function(){
    my.makePhoneCall({ number: '4001280528' });
  },
  copy: function() {
    my.setClipboard({
      text: this.data.text,
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

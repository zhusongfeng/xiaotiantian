
Page({
  data: {
  },
  scan: function() {
    my.scan({
      type: 'qr',
      success: (res) => {
        console.log('111111111' + res.code);
        // my.alert({ title: res.code });
      },
      error: (res) => {
        console.log('222222' + res.code);
      }
    });
  },
  onShareAppMessage() {
    return {
      title: '书堆儿',
      desc: '免费借阅纸质图书，快递配送，全程免费态',
      path: 'pages/index/index'
    };
  },
})
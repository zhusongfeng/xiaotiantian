const app = getApp();
Page({
  data: {
  },
  onLoad() {
    //判断登录

  },
  onShow:function(){
    var _this = this;
    my.httpRequest({
      url: app.globalData.server + '/api/v5/mini/myInfo',
      data: {
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: function(res) {
        my.hideLoading({});
        if (!res.data.status) {
          my.navigateTo({
            url: '../../login/passwordLogin/passwordLogin',
          })
        } else {
          my.showLoading({ content: '加载中...', });
          const that = _this;
          my.httpRequest({
            url: app.globalData.server + '/api/v5/user/borrowByLib',
            data: {
              openid: app.globalData.openid,
              client: 'alipay_mini'
            },
            success: (res) => {
              my.hideLoading({});
              var data = res.data.data;
              if (data == null || data == '') {
                var message = '暂无借阅信息';
              } else {
                var message = '';
              }
              for (var index in data) {
                var borrowList = data[index].borrowList;
                var name = data[index].name;
                for (var i in borrowList) {
                  var title = borrowList[i].title;
                  var author = borrowList[i].author;
                  var barcode = borrowList[i].barcode;
                  var borrowtime = borrowList[i].borrowtime;
                  var backtime = borrowList[i].backtime;
                }
              }
              that.setData({
                data: data,
                borrowList: borrowList,
                message: message
              })
            },
          });
        }
      }
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

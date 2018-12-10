const app = getApp()
Page({
  data: {
    ecardFee: "",
    authCode:'',
    ecardorder_id:''
  },
  onLoad(e) {
    var ecardorder_id = e.ecardorder_id;
    this.setData({
      ecardorder_id: ecardorder_id
    })
    my.getAuthCode({
      scopes: 'auth_base',
      success: (res) => {
        this.setData({
          authCode: res.authCode
        })
      },
    });
  },
  onShow: function(e) {
    var _this = this;
    my.httpRequest({
      url: app.globalData.server + '/api/v4/ecard/getEcardFee',
      data: {
        openid: app.globalData.openid,
        client: 'alipay_mini',
      },
      success: function(res) {
        if (res.data.status){
          _this.setData({
            ecardFee: res.data.fee
          });
        }else{
          my.showToast({
            content: res.data.message,
            duration:2000
          });
        }
      }
    })
  },
  click:function(e){
    var _this = this;
    var authCode = this.data.authCode;
    my.httpRequest({
      url: app.globalData.server + '/api/v5/zhima/alipayEcard',
      data: {
        openid: app.globalData.openid,
        client: 'alipay_mini',
        ecardorder_id: this.data.ecardorder_id,
        authcode: authCode
      },
      success: (res) => {
        var trade_no = res.data.trade_no;
        if(res.data.status){
          my.tradePay({
            tradeNO: trade_no,
            success: (res) => {
              if (res.resultCode==9000){
                my.httpRequest({
                  url: app.globalData.server + '/api/v5/user/payOk',
                  data: {
                    openid: app.globalData.openid,
                    client: 'alipay_mini',
                    ecardorder_id: this.data.ecardorder_id,
                  },
                  success: (res) => {
                    if (res.data.status) {
                      my.redirectTo({
                        url: '../../cardList/cardList?ecardorder_id=' + this.data.ecardorder_id,
                      });
                    }
                  },
                });
              } else if (res.resultCode == 6001 || res.resultCode == 4000 || res.resultCode == 6002){

              }
            },
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

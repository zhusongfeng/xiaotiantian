//app.js
App({
  onLaunch: function(options) {

    // 获取openid
    var _this = this;
    my.getAuthCode({
      scopes: 'auth_base',
      success: (res) => {
        if (res.authCode) {
          my.httpRequest({
            url: _this.globalData.server + '/api/v5/zhima/getUserid',
            data: {
              code: res.authCode
            },
            success: (res) => {
              _this.globalData.openid = res.data.openid;
            },
          });
        }
      },
    });
    
    // 扫码售书业务
    // 获取关联普通二维码的码值，放到全局变量qrCode中
    if (options.query && options.query.qrCode) {
      var qrCode = options.query.qrCode;
      var sell_url = _this.globalData.sell_url;
      if (qrCode.indexOf(sell_url) == 0) {
        // 售书二维码的code
        var sgr_code = qrCode.replace(sell_url, '').split('?')[0];
        my.showLoading({ content: '加载中...' });
        // 判断是否签约
        my.getAuthCode({
          scopes: 'auth_user',
          success: (res) => {
            var authcode = res.authCode;
            var code = sgr_code;
            my.httpRequest({
              url: _this.globalData.sgr_server + '/api/sell/alipay/sign?authCode=' + authcode,
              success: function(res) {
                var _this2 = _this;
                var user_id = res.data.user_id;
                if (res.data.is_sign) {
                  //  开柜门
                  _this2.opendoor(code, user_id);
                } else {
                  // 未签约，先签约
                  var sign = res.data.sign;
                  my.paySignCenter({
                    signStr: sign,
                    success: (res) => {
                      var _this3 = _this2;
                      my.hideLoading();
                      if (res.resultStatus == 7000) {
                        var result = res.result;
                        var response = JSON.parse(result).alipay_user_agreement_page_sign_response;
                        my.httpRequest({
                          url: _this.globalData.sgr_server + '/api/sell/alipay/signResult',
                          data: { data: JSON.stringify(response) },
                          success: (res) => {
                            if (res.data.errcode == 0) {
                              // 开柜门
                              _this3.opendoor(code, user_id);
                            }
                          },
                        });
                      }
                    },
                    fail: (res) => {
                      my.hideLoading();
                      my.alert({
                        title: 'fail',
                        content: JSON.stringify(res)
                      });
                    }
                  });
                }
              }
            })
          },
        });
      }
    } 
  },

  // 开柜门
  opendoor: function(code, user_id){
    my.httpRequest({
      url: this.globalData.sgr_server + '/api/sell/openDoorno',
      data: { 
        code: code, 
        user_id: user_id 
      },
      success: (res) => {
        my.hideLoading();
        if (res.data.errcode != 0) {
          my.alert({
            title: '提示',
            content: res.data.errmsg
          });
        } else {
          // 正在开柜门
          var _this = this;
          my.showLoading({ content: '正在打开柜门...' });
          // 轮询获取书柜的状态
          var interval = setInterval(function() {
            my.httpRequest({
              url: _this.globalData.sgr_server + '/api/sell/isOpenDoor',
              data: {
                code: code,
                user_id: user_id
              },
              success: function(res) {
                if (res.data.errcode != 0) {
                  // 打开异常
                  clearInterval(interval);
                  my.hideLoading();
                  my.alert({
                    title: '提示',
                    content: res.data.errmsg
                  });
                }else if (res.data.status == 3) {
                  var _this2 = _this;
                  // 打开成功
                  clearInterval(interval);
                  my.hideLoading();
                  my.alert({
                    title: '提示',
                    content: res.data.errmsg,
                    success: () => {
                      // 轮询获取购书结果
                      var nowtime = new Date().getTime();
                      var interval_sell = setInterval(function() {
                        my.httpRequest({
                          url: _this2.globalData.sgr_server + '/api/sell/sellResult',
                          data: {
                            code: code,
                            user_id: user_id,
                            nowtime: nowtime
                          },
                          success: function(res) {
                            if (res.data.errcode != 0 || res.data.is_done) {
                              clearInterval(interval_sell);
                            } 
                            if (res.data.sell_id) {
                              var sell_id = res.data.sell_id;
                              my.confirm({
                                title: '温馨提示',
                                content: JSON.stringify(res),
                                confirmButtonText: '查看详情',
                                cancelButtonText: '暂不需要',
                                success: (result) => {
                                  if (result.confirm) {
                                    my.navigateTo({
                                      url: "../../pages/component/purchaseDetails/purchaseDetails?sell_id=" + sell_id
                                    });
                                  }
                                },
                              });
                            }
                          }
                        })
                      }, 1000);
                    }
                  });
                } 
              }
            })
          }, 1000);
        } 
      }
    })
  },

  globalData: {
    // server: 'http://test59.shuduier.com',
    // sgr_server: 'http://59.110.41.172',
    server: 'http://www.shuduier.com',
    sgr_server: 'http://weitu.shuduier.com',
    sell_url: 'http://weitu.shuduier.com/amini/sell/',
    openid: '',
    scan_tip: true,
    client: 'alipay_mini'
  }
})
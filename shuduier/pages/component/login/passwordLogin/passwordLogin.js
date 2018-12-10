
const app = getApp();
var interval = null; //倒计时函数
Page({
  data: {
    phone: '',
    code: '',
    phoneCode: '',
    time: '获取验证码', //倒计时 
    currentTime: 61,
  },
  //获取手机号
  phoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //获取联系地址
  codeInput: function(e) {
    this.setData({
      code: e.detail.value
    })
  },
  account_val: function(e) {
    this.setData({
      phone: e.detail.value.replace(/\s+/g, "")
    })
  },
  // 获取验证码
  getCode: function(e) {
    var _this = this;
    var currentTime = _this.data.currentTime
    interval = setInterval(function() {
      currentTime--;
      _this.setData({
        time: currentTime + '秒后重新获取'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        _this.setData({
          time: '重新发送',
          currentTime: 61,
          disabled: false
        })
      }
    }, 1000)
  },
  getVerificationCode() {
    var phone = this.data.phone;
    if (!(/^1[3456789]\d{9}$/.test(phone))) {
      my.showToast({ content: '请输入正确的手机号码', duration: 2000 })
      return;
    }
    this.getCode();
    this.setData({
      disabled: true
    });
    var _this = this;
    my.httpRequest({
      url: app.globalData.server + '/api/v5/mini/phoneCode',
      data: {
        phone: this.data.phone,
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: function(res) {
        _this.setData({
          phoneCode: res.data.phoneCode
        });
      }
    })
  },
  // 登录
  loginIn: function(e) {
    var _this = this;
    my.getStorage({
      key: 'openid', // 缓存数据的key
      success: (res) => {
        if (res.success) {
          var openid = res.data.openid; 
          if(openid){
            _this.login(_this);
          }
          else{
            my.getAuthCode({
              success: function(res) {
                if (res.authCode) {
                  my.httpRequest({
                    url: app.globalData.server + '/api/v5/zhima/getUserid',
                    data: {
                      code: res.authCode,
                      openid: app.globalData.openid,
                      client: 'alipay_mini'
                    },
                    success: (res) => {
                      app.globalData.openid = res.data.openid;
                      _this.login(_this);
                    },
                  });
                }
              }
            })
          }
        }
      },
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  // 登录
  
  login: function(p) {
    var phone = p.data.phone;
    var code = p.data.code;
    var phoneCode = p.data.phoneCode;
    if (!(/^1[3456789]\d{9}$/.test(phone))) {
      my.showToast({ content: '请输入正确的手机号码', duration: 2000 })
      return;
    }
    if (!code) {
      my.showToast({ content: '请输入验证码',duration: 2000 })
      return;
    }
    if (!phoneCode) {
      my.showToast({ content: '请先获取验证码',  duration: 2000 })
      return;
    }  
    my.httpRequest({
      url: app.globalData.server + '/api/v5/mini/loginByCode',
      data: {
        phone: phone, code: code, phoneCode: phoneCode,
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: function(res) {
        if (res.data.status) {
          my.navigateBack({

          });
          my.showToast({ content: "登录成功！", duration: 2000 });
          my.setStorage({
            key: 'phones', // 缓存数据的key
            data: phone, // 要缓存的数据
            success: function(res) {
            }
          });

        } else {
          my.showToast({ content: res.data.message, duration: 2000 });
          return;
        }
      }
    })
  },
  onShareAppMessage() {
    return {
      title: '书堆儿',
      desc: '免费借阅纸质图书，快递配送，全程免费',
      path: 'pages/index/index'
    };
  },
})
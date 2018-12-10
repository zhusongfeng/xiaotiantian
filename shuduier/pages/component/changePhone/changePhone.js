
const app = getApp();
var interval = null; //倒计时函数
Page({
  data: {
    phone: '',
    newPhone:'',
    code: '',
    phoneCode: '',
    time: '获取验证码', //倒计时 
    currentTime: 61,
  },
  onLoad: function(options) {
    var _this = this;
    my.getStorage({
      key: 'phones', // 缓存数据的key
      success: (res) => {
        if (res.success) {
          _this.setData({
            phone: res.data
          })
        }
      },
    });
  },

  //获取新手机号
  phoneInput: function(e) {
    this.setData({
      newPhone: e.detail.value
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
      newPhone: e.detail.value.replace(/\s+/g, "")
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
  getVerificationCode:function() {
    var newPhone = this.data.newPhone;
    if (!(/^1[3456789]\d{9}$/.test(newPhone))) {
      my.showToast({ content: '请输入正确的手机号码', duration: 2000 })
      return;
    }
    this.getCode();
    this.setData({
      disabled: true
    });
    var _this = this;
    my.httpRequest({
      url: app.globalData.server + '/api/user/phoneCode',
      data: {
        phone: newPhone,
        type:1,
        isSessionPhone:1,
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: function(res) {
        if (res.data.errorKey == "existPhone"){
          my.showToast({ content: '改手机号已被注册', duration: 2000 });
          return;
        } else if (res.data.errorKey == "notExistPhone"){

        }
      }
    })
  },
  changePhone:function(){
    var newPhone = this.data.newPhone;
    var code =this.data.code;
    if(this.data.phone==newPhone){
      my.showToast({ content: '请输入不同的手机号码', duration: 2000 })
      return;
    }
    if (!(/^1[3456789]\d{9}$/.test(newPhone))) {
      my.showToast({ content: '请输入新的的手机号码', duration: 2000 })
      return;
    }
    if (!code) {
      my.showToast({ content: '请输入验证码', duration: 2000 })
      return;
    }
    my.httpRequest({
      url: app.globalData.server + '/api/user/changePhone',
      data:{
        phone: newPhone,
        code:code,
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: (res) => {
        if(res.data.status){
         my.navigateBack({
           detail:1
         });
        }
      },
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  onShareAppMessage() {
    return {
      title: '书堆儿',
      desc: '免费借阅纸质图书，快递配送，全程免费',
      path: 'pages/index/index'
    };
  },
})
const app = getApp();
Page({
  data: {},
  //获取读者证号
  cardInput: function(e) {
    this.setData({
      cardNum: e.detail.value
    })
  },
  //获取姓名
  nameInput: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  //获取身份证号
  idcardInput: function(e) {
    this.setData({
      idcard: e.detail.value
    })
  },
  submit:function(e){
    var _this = this;
    var cardNum = this.data.cardNum;
    var name = this.data.name;
    var idcard = this.data.idcard;
    if (!cardNum) {
      my.showToast({ content: '请输入读者证号', duration: 2000 })
      return;
    }
    if (!name) {
      my.showToast({ content: '请输入姓名',  duration: 2000 })
      return;
    }
    if (!(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(idcard))) {
      my.showToast({ content: '请输入正确的身份证号',  duration: 2000 })
      return;
    }
    my.httpRequest({
      url: app.globalData.server + '/api/v5/mini/unlockReadercard',
      data: {
        openid: app.globalData.openid,
        client: 'alipay_mini',
        cardno: cardNum,
        name: name,
        idno: idcard
      },
      success: (res) => {
        if (res.data.errcode==-1){
          my.showToast({ content: res.data.errmsg, duration: 2000 })
        }else{
          my.alert({
            title: '温馨提示',
            content: '解锁成功！点击确定后您可正常在书柜上进行操作',
            buttonText: '确定',
            success: () => {
              my.reLaunch({
                url: '../../../index/index',
              });
            },
          });
        }
      },
    });
  },
  onLoad() {},
  onShareAppMessage() {
    return {
      title: '书堆儿',
      desc: '免费借阅纸质图书，快递配送，全程免费',
      path: 'pages/index/index'
    };
  },
});

const app = getApp();
Page({
  data: {
    libArray: [],
    libIndex: 0,
    realName: '',
    cardno: '',
    phone: '',
    address: '',
    jobArray: ['国家公务员','文教卫体公务员', '工程技术人员', '商业服务人员','军人', '工人', '学生', '少儿', '外籍人员','其它'],
    jobIndex: 0,
    eduArray: ['学龄前', '小学', '初中', '高中', '中专', '大专', '本科', '研究生', '硕士', '博士及博士后'],
    eduIndex: 0,
    tab: 1,
    itemList: {
      hidden: true
    },
    libsArray: [],
    libsIndex: 0,
    libIndexCode: '',
    cardNum:'',
    pswd:'',
    name:'',
    card:''
  },
  tab_slide: function(e) {//滑动切换tab 
    var that = this;
    that.setData({ tab: e.detail.current });
  },
  tab_click: function(e) {//点击tab切换
    var that = this;
    if (that.data.tab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        tab: e.target.dataset.current
      })
    }
    var mac = e.mac;
    my.httpRequest({
      url: app.globalData.server + '/api/v4/org/orgList',
      success: function(res) {
        var orgList = res.data.orgList;
        that.setData({
          libsArray: orgList,
        })
        var _this2 = that;
        if (mac != null && mac != '' && mac != 'undefined') {
          my.httpRequest({
            url: app.globalData.server + '/api/v5/mini/getOrg',
            data: { mac: mac, client: 'alipay_mini', openid: app.globalData.openid },
            success: function(res) {
              var code = res.data.org_code;
              for (var index in orgList) {
                if (orgList[index].code == code) {
                  _this2.setData({
                    libsIndex: index,
                    libsIndexCode: code,
                  })
                }
              }
            }
          })
        }
      }
    })
  },
  tab_click1: function(e) {//点击tab切换
    var that = this;
    if (that.data.tab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        tab: e.target.dataset.current
      })
    }
    var _this = this;
    var org_code = e.org_code;
    my.httpRequest({
      url: app.globalData.server + '/api/org/hasEcardOrgList',
      data: {
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: (res) => {
        var orgList = res.data.orgList;
        _this.setData({
          libArray: orgList,
        })
        var _this2 = _this;
        for (var index in orgList) {
          if (orgList[index].code == org_code) {
            _this2.setData({
              libIndex: index,
            })
          }
        }
      },
    });
  },
  bindChangeLib: function(e) {
    this.setData({
      libIndex: e.detail.value
    })
  },
  bindChangeJob: function(e) {
    this.setData({
      jobIndex: e.detail.value
    })
  },
  bindChangeEdu: function(e) {
    this.setData({
      eduIndex: e.detail.value
    })
  },
  //获取用户输入的用户名
  realNameInput: function(e) {
    this.setData({
      realName: e.detail.value
    }) 
  },
  //获取身份证号码
  cardnoInput: function(e) {
    this.setData({
      cardno: e.detail.value
    })
  },
  //获取手机号
  phoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //获取联系地址
  addressInput: function(e) {
    this.setData({
      address: e.detail.value
    })
  },
  onLoad(e) {
    var mac = e.mac;
    var _this=this;
    my.httpRequest({
      url: app.globalData.server + '/api/v4/org/orgList',
      success: function(res) {
        var orgList = res.data.orgList;
        _this.setData({
          libsArray: orgList,
        })
        var _this2 = _this;
        if (mac != null && mac != '' && mac != 'undefined') {
          my.httpRequest({
            url: app.globalData.server + '/api/v5/mini/getOrg',
            data: { mac: mac, client: 'alipay_mini', openid: app.globalData.openid },
            success: function(res) {
              var code = res.data.org_code;
              for (var index in orgList) {
                if (orgList[index].code == code) {
                  _this2.setData({
                    libsIndex: index,
                    libsIndexCode: code,
                  })
                }
              }
            }
          })
        }
      }
    })
  },
  clicks:function(){
    var realName = this.data.realName;
    var cardNo = this.data.cardno;
    var mobile = this.data.phone;
    var address = this.data.address;
    var org_id = this.data.libArray[this.data.libIndex].org_id;
    var job = this.data.jobArray[this.data.jobIndex];
    var education = this.data.eduArray[this.data.eduIndex];
    if (!org_id) {
      my.showToast({ content: '请选择机构',  duration: 2000 })
      return;
    }
    if (!realName) {
      my.showToast({ content: '请输入真实姓名', duration: 2000 })
      return;
    }
    if (!cardNo) {
      my.showToast({ content: '请输入身份证号',  duration: 2000 })
      return;
    }
    if (!(/^1[34578]\d{9}$/.test(mobile))){
      my.showToast({ content: '请输入正确的手机号', duration: 2000 })
        return;
    }
    // if(mobile==null||mobile==''){
    // }else{
    //   if (!(/^1[34578]\d{9}$/.test(mobile))) {
    //     my.showToast({ content: '请输入正确的手机号', duration: 2000 })
    //     return;
    //   }
    // }
    var _this = this;
    my.httpRequest({
      url: app.globalData.server + '/api/v5/user/subInfo',
      data:{
        openid: app.globalData.openid,
        client: 'alipay_mini',
        org_id: org_id, name: realName, idno: cardNo, 
        mobile: mobile, address: address, job: job, education: education
      },
      success: (res) => {
        if (res.data.status){
          if (res.data.errorKey == "nextToWxpay") {
            my.redirectTo({
              url: "../onlineCertificate/certificateSecond/certificateSecond?ecardorder_id=" + res.data.ecardorder_id
            })
          } else if (res.data.errorKey == "nextToAudit"){
            my.redirectTo({
              url: "../submitSuccess/submitSuccess?ecardorder_id=" + res.data.ecardorder_id
            })
          } else if (res.data.errorKey == "alreadyEcardorder"){
            my.showToast({
              content: res.data.message,
              duration:2000
            })
          }
        }else{
          my.showToast({ content: res.data.message, duration: 2000 })
          return;
        }
      },
    });
  },
  onShow: function() {
    
  },
  bingingBtn:function(){
    
  },
  onChangeLib:function(e){
    var libIndex = e.detail.value;
    var libIndexCode = this.data.libsArray[libIndex].code;
    this.setData({
      libsIndex: libIndex,
      libIndexCode: libIndexCode,
    })
  },
  cardnoInputs:function(e){
    this.setData({
      cardno: e.detail.value
    })
  },
  cardpwdInput: function(e) {
    this.setData({
      cardpwd: e.detail.value
    })
  }, 
  // 绑卡
  binding: function(e) {
    var cardno = this.data.cardno;
    var cardpwd = this.data.cardpwd;
    var org_id = this.data.libsArray[this.data.libsIndex].id;
    if (!cardno || !cardpwd) {
      my.showToast({ content: '请将信息填写完整',  duration: 2000 })
      return;
    }
    my.showLoading({ content: '加载中...', });
    my.showLoading({
      success: (res) => {
        content: '请稍后...'
      }
    });
    my.httpRequest({
      url: app.globalData.server + '/api/v4/user/bindingCard',
      data: {
        cardno: cardno, cardpwd: cardpwd, org_id: org_id,
        openid: app.globalData.openid, client: 'alipay_mini',
      },
      success: function(res) {
        console.log('aaaaaaaaaa' + JSON.stringify(res))
        my.hideLoading({});
        if (res.data.status) {
          my.showToast({
            content: '绑定成功',
            duration:2000,
          })
          my.navigateBack({
            delta: 1
          });
        } else {
          my.showToast({ content: res.data.message +',如果遇到问题请联系客服电话：400-128-0528',  duration: 2000 })
            return;
        }
      }
    })
  },
  click: function(query) {
    var that = this;
    var index = query.currentTarget.dataset.index;
    var now = "itemList[" + index + "].hidden";
    if (that.data.itemList[index].hidden == true) {
      that.setData({
        [now]: false,
      })
    } else {
      that.setData({
        [now]: true,
      })
    }
  },
  onShareAppMessage() {
    return {
      title: '书堆儿',
      desc: '免费借阅纸质图书，快递配送，全程免费',
      path: 'pages/index/index'
    };
  },
})
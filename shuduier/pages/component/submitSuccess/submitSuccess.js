const app = getApp();
Page({
  data: {
    borrowperiod:'',
    maxborrow:'',
    statusStr:'',
    ecardorderno:'',
    reasonList:'',
    name:'',
    idno:'',
    job:'',
    education:'',
    mobile:'',
    address:'',
    status:'',
    nextKey:'',
    ecardorder_id:'',
    orgName:''
  },
  onLoad(e) {
    var _this=this;
    var ecardorder_id = e.ecardorder_id;
    _this.setData({
      ecardorder_id: ecardorder_id
    })
    my.httpRequest({
      url: app.globalData.server + '/api/v5/user/ecardOrderInfo',
      data: {
        openid: app.globalData.openid,
        client: 'alipay_mini',
        ecardorder_id: ecardorder_id
      },
      success: (res) => {
        _this.setData({
          statusStr: res.data.statusStr,
          ecardorderno: res.data.ecardorderno,
          reasonList: res.data.reasonList,
          name: res.data.name,
          idno: res.data.idno,
          job: res.data.job,
          education: res.data.education,
          mobile: res.data.mobile,
          address: res.data.address,
          status:res.data.status,
          nextKey: res.data.nextKey,
          orgName: res.data.orgName
        })
      },
    });
    my.httpRequest({
      url: app.globalData.server + '/api/v4/borrow/borrowRule',
      data: {
        openid: app.globalData.openid,
        client: 'alipay_mini',
        readercard_id: ecardorder_id
      },
      success: (res) => {
        var data=res.data;
        _this.setData({
          maxborrow: data.maxborrow,
          borrowperiod: data.borrowperiod
        })
      },
    });
  },
  mobile:function(){
    my.makePhoneCall({ number: '400-128-0528' });
  },
  onceClick:function(){
    if (this.data.nextKey == "subInfoNotpass"){
      my.redirectTo({
        url: '../tieCard/tieCard', 
      });
    } else if (this.data.nextKey == "subPayNotpass"){
      my.redirectTo({
        url: '../onlineCertificate/certificateSecond/certificateSecond?ecardorder_id=' + this.data.ecardorder_id,
      });
    }
  },
  onShareAppMessage() {
    return {
      title: '书堆儿',
      desc: '免费借阅纸质图书，快递配送，全程免费',
      path: 'pages/index/index'
    };
  },
});

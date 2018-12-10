const app = getApp();
Page({
  data: {
    list:'',
    address: '',
    name: '',
    mobile: '',
    // addressStr: '',
    address:'',
    address_id: '',
    area_code:'',
    city_code:'',
    province_code:'',
    is_default: '',
    provice_name:'',
    city_name:'',
    area_name:'',
  },
  nameInput: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  mobileInput: function(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  addressStrInput: function(e) {
    this.setData({
      address: e.detail.value
    })
  }, 
  switchChange(e) {
    this.setData({
      is_default:e.detail.value
    })
  },
  onLoad(query) {
    var _this = this;
    _this.setData({
      address_id: query.address_id,
    })
    my.httpRequest({
      url: app.globalData.server + '/api/v5/addressList',
      data:{
        openid: app.globalData.openid,
        client: 'alipay_mini'
      },
      success: (res) => {
        var list=res.data.list
        _this.setData({
          list:list,
        })
        my.setStorage({
          key: 'area', // 缓存数据的key
          data: list, // 要缓存的数据
          success: (res) => {
          },
        });
      },
    });
  },
  onShow: function() {
    var address_id = this.data.address_id;
    var _this = this;
    if (address_id) {
     my.httpRequest({
        url: app.globalData.server + '/api/user/addressInfo/' + address_id,
        data:{
          openid: app.globalData.openid,
          client: 'alipay_mini'
        },
       success: function(res) {
          _this.setData({
            address: res.data.address,
            name: res.data.address.name,
            mobile: res.data.address.mobile,
            // addressStr: res.data.address.addressStr,
            address: res.data.address.address,
            province_name: res.data.address.province.name,
            city_name: res.data.address.city.name,
            area_name: res.data.address.area.name,
            area_code: res.data.address.area.code,
            city_code: res.data.address.city.code,
            province_code: res.data.address.province.code,
            is_default: res.data.address.is_default
          })
        }
      });
    }
  },
  click:function(e){
    my.getStorage({
      key: 'area', // 缓存数据的key
      success: (res) => {
        my.multiLevelSelect({
          list: res.data,
          success: (res) => {
            var province_name = res.result[0].name;
            var city_name = res.result[1].name;
            var area_name = res.result[2].name;
            this.setData({
              province_name: province_name,
              city_name: city_name,
              area_name: area_name
            });
            my.httpRequest({
              url: app.globalData.server + '/api/v5/getAddressCode',
              data:{
                openid: app.globalData.openid,
                client: 'alipay_mini',
                province_name: province_name,
                city_name: city_name,
                area_name: area_name
              },
              success: (res) => {
                var area_code = res.data.area_code;
                var city_code = res.data.city_code;
                var province_code = res.data.province_code;
                this.setData({
                  area_code: area_code,
                  city_code: city_code,
                  province_code: province_code
                })
              },
            });
          },
        })
      },
    });
  },
  addAddress:function(){
    var name = this.data.name;
    var mobile = this.data.mobile;
    // var addressStr = this.data.addressStr;
    var address = this.data.address;
    var province_code = this.data.province_code;
    var city_code = this.data.city_code;
    var area_code = this.data.area_code;
   
    if (this.data.is_default){
      this.data.is_default=1;
    }else{
      this.data.is_default = 0;
    }
    if (!name) {
      my.showToast({ content: '请输入姓名',  duration: 2000 })
      return;
    }
    if (!(/^1[3456789]\d{9}$/.test(mobile))) {
      my.showToast({ content: '请输入正确的手机号码',  duration: 2000 })
      return;
    }
    if (!address) {
      my.showToast({ content: '请输入详细地址', duration: 2000 })
      return;
    }
    if (!province_code || !city_code || !area_code){
      my.showToast({ content: '请选择地址', duration: 2000 })
      return;
    }
    var _this = this;
    this.setData({
      disabled: true
    })
    my.httpRequest({
      url: app.globalData.server + '/api/user/editAddress/' + this.data.address_id,
      data:{
        openid: app.globalData.openid,
        client: 'alipay_mini',
        name: name,
        phone: mobile,
        address: address,
        province_code: province_code,
        city_code:city_code,
        area_code: area_code,
        is_default: this.data.is_default ,
      },
      success: (res) => {
        if(res.data.status){
          my.navigateBack({
            delta: 1
          });
        }else{
          my.showToast({ content: res.data.message, duration: 2000});
          return;
        }
      },
    });
  },
  delete:function(){
    var address_id = this.data.address_id;
    var _this = this;
    my.confirm({
      title:'温馨提示',
      content:'您确定删除该地址吗?',
      confirmButtonText: '立即删除',
      cancelButtonText: '暂不删除',
      success: (res) => {
        if(res.confirm){
          my.httpRequest({
            url: app.globalData.server + '/api/user/deleteAddress/' + address_id,
            data: {
              openid: app.globalData.openid,
              client: 'alipay_mini',
            },
            success: (res) => {
              my.redirectTo({
                url: '../addressList/addressList', 
              });
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

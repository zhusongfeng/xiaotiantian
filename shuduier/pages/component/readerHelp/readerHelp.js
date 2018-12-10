const app = getApp();
var statusArrs = [true,true,true,true,true,true,true]
Page({
  data: {
    showArr: statusArrs
  },
  tigger: function(e) {
    var that = this;
    var num = e.currentTarget.dataset.num
    statusArrs[num] = !statusArrs[num]
    that.setData({
      showArr: statusArrs
    })
  },
  onLoad(query) {
 
  },
  onShareAppMessage() {
    return {
      title: '书堆儿',
      desc: '免费借阅纸质图书，快递配送，全程免费',
      path: 'pages/index/index'
    };
  },
});

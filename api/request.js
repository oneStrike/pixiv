const baseURL = 'https://api.imjad.cn/pixiv/v2/';
// const baseURL = 'https://api.acg-gov.com/public/ranking';
export default function request(url, data = {}, method = 'get', header,) {
  return new Promise((resolve, reject) => {
    uni.showLoading({
      title:'加载中'
    })
    uni.request({
      url: baseURL + url,
      data,
      method,
      header:{
        'content-type':'application/x-www-form-urlencoded'
      },
      success: function (result) {
        resolve(result.data);
        uni.hideLoading()
      },
      fail: function () {
        reject('数据请求失败');
        uni.hideLoading()
      }
    })
  })
}
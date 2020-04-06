// 防止多个请求同时发生
let times = 0
export const mpRequest = (params) => {
  times++
  // 自动根据地址，携带请求头
  let header = {...params.header}
  if(params.url.includes('/my/')){
    header['Authorization'] = wx.getStorageSync('token')
  }
  wx.showLoading({
    title: '加载中',
    mask: true
  })
  const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1'
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      header:header,
      url: baseUrl + params.url,
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      },
      complete: () => {
        times--
        if (times == 0) wx.hideLoading()
      }
    })
  })
}
import {
  login
} from '../../utils/asyncWx.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'
import { mpRequest} from '../../request/index.js'
Page({
  async handleGetUserInfo(e){
    try{
      // 获取用户信息
      const { encryptedData, rawData, iv, signature } = e.detial
      // 获取小程序登录成功的code
      const { code } = await login()
      const loginParams = { encryptedData, rawData, iv, signature, code }
      const { token } = mpRequest({ url: '/users/wxlogin', data: loginParams, method: 'post' })
      wx.setStorageSync('token', token)
      wx.navigateBack({
        delta: 1,
      })
    }catch(err){
      console.log(err)
    }
  }
})
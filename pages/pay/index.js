// pages/cart/index.js
import {
  getSetting,
  openSetting,
  chooseAddress,
  showModal,
  showToast,
  requestPayment
} from '../../utils/asyncWx.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'
import { mpRequest } from '../../request/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户的地址
    address: {},
    // 用户订单
    cart: [],
    // 总价
    totalPrice: 0,
    // 总数
    totalNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow() {
    const address = wx.getStorageSync('address')
    let cart = wx.getStorageSync('cart') || []
    // 过滤后的购物车
    cart = cart.filter(item => item.checked)
    // 计算价格
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(item => {
      totalPrice += item.num * item.message.goods_price
      totalNum += item.num
    })
    this.setData({
      cart,
      address,
      totalNum,
      totalPrice
    })
  },
  // 点击支付的按钮
  async handleOrderPay() {
   try{
     const token = wx.getStorageSync('token')
     if (!token) {
       wx.navigateTo({
         url: '/pages/auth/index',
       })
       return
     }
     // 创建订单
    //  const header = { Authorization: token }
     const order_price = this.data.totalPrice
     const consignee_addr = this.data.address.all
     let goods = []
     const cart = this.data.cart
     cart.forEach(item => goods.push({
       goods_id: item.message.goods_id,
       goods_num: item.num,
       goods_price: item.message.goods_price
     }))
     const orderParams = { order_price, consignee_addr, goods, }
     const { order_number } = await mpRequest({ url: '/my/orders/create', method: 'post', data: orderParams,  })
     // 预支付
     const { pay } = await mpRequest({ url: '/my/orders/req_unifiedorder', data: { order_number },  method: 'post' })
     // 支付
     await requestPayment(pay)
     // 查询后台订单进行确认
     const res = await mpRequest({ url: '/my/orders/chkOrder', data: { order_number }, method: 'post' })
     await showToast({title:'支付成功'})
    //  将本地缓存中已经结算的商品删除
    let newCart = wx.getStorageSync('cart')
    newCart = newCart.filter(item=>!item.checked)
    wx.setStorageSync('cart', newCart)
     wx.navigateTo({
       url: '/pages/order/index'
     })
   }catch(err){
     await showToast({title:'支付失败'})
     console.log(err)
   }
  }

})
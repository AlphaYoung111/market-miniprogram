// pages/cart/index.js
import {
  getSetting,
  openSetting,
  chooseAddress,
  showModal,
  showToast
} from '../../utils/asyncWx.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户的地址
    address: {},
    // 用户订单
    cart: [],
    // 全选
    allChecked: false,
    // 总价
    totalPrice: 0,
    // 总数
    totalNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  onShow() {
    const address = wx.getStorageSync('address')
    const cart = wx.getStorageSync('cart') || []
    // const allChecked = cart.length?cart.every(item=>item.checked):false
    this.setCart(cart)
    this.setData({
      address
    })
  },
  // 点击获取收货地址
  async handleChooseAddress() {
    try {
      //  为了保证用户给了权限
      const res1 = await getSetting()
      const scopeAddress = res1.authSetting['scope.address']
      if (scopeAddress === false) {
        await openSetting()
      }
      let address = await chooseAddress()
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
      wx.setStorageSync('address', address)
    } catch (err) {
      console.log(err)
    }
  },
  // 商品选中状态改变
  handleItemChange(e) {
    const goods_id = e.currentTarget.dataset.id
    let {
      cart
    } = this.data
    let index = cart.findIndex(item => item.message.goods_id === goods_id)
    cart[index].checked = !cart[index].checked
    this.setData({
      cart
    })
    wx.setStorageSync('cart', cart)
    this.setCart(cart)
  },
  // 设置状态，重新计算价格
  setCart(cart) {
    let allChecked = true
    // 计算价格
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(item => {
      if (item.checked) {
        totalPrice += item.num * item.message.goods_price
        totalNum += item.num
      } else {
        allChecked = false
      }
    })
    allChecked = cart.length ? allChecked : false
    this.setData({
      cart,
      allChecked,
      totalNum,
      totalPrice
    })
    wx.setStorageSync('cart', cart)
  },
  // 全选按钮改变事件
  handleItemAllChecked() {
    let {
      cart,
      allChecked
    } = this.data
    allChecked = !allChecked
    cart.forEach(item => item.checked = allChecked)
    this.setCart(cart)
  },
  // 点击增加删减数量
  async handleItemNumRdit(e) {
    const {operation,id} = e.currentTarget.dataset
    let {cart} = this.data
    let index = cart.findIndex(item => item.message.goods_id === id)
    // 判断数量出现0的情形
    if (cart[index].num === 1 && operation === -1) {
      const res = await showModal({ content: '您确定要删除商品吗？' })
      if (res.confirm) {
        cart.splice(index, 1)
        this.setCart(cart)
      }
    } else {
      cart[index].num += operation
      this.setCart(cart)
    }
  },
  // 点击结算
  async handlePay(){
    const {address,totalNum} =this.data
    // 收货地址
    if(!address.userName){
      await showToast({title:'请添加收货地址'})
      return
    }
    // 有没有商品
    if(totalNum===0){
      await showToast({title:'请添加商品至购物车'})
      return
    }
    // 两者都有
    wx.navigateTo({
      url: '/pages/pay/index'
    })
  }
})
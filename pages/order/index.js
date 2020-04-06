// pages/order/index.js
import {
  mpRequest
} from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    tabs:[
      {
        id:0,
        value:'全部订单',
        isActive:true
      },
      {
        id: 1,
        value: '待付款',
        isActive: false
      },
      {
        id: 2,
        value: '待发货',
        isActive: false
      },
      {
        id: 3,
        value: '退款/退货',
        isActive: false
      },
    ]
  },
  // tabs栏点击
  handleTabsItemChange(e){
    const {index} = e.detail
    console.log(e)
    this.changeTitleByIndex(index)
    this.getOrders(index+1)
  },
  // 根据type显示索引
  changeTitleByIndex(index){
    let { tabs } = this.data
    tabs.forEach((item, i) => i === index ? item.isActive = true : item.isActive = false)
    this.setData({ tabs })
  },
  onShow(){
    // 判断是否有token
    const token = wx.getStorageSync('token')
    // if(!token){
    //   wx.navigateTo({
    //     url: '/pages/auth/index'
    //   })
    //   return 
    // }
    // 由于除了onload以外都拿不到url参数，所以使用页面栈来获取
    let pages = getCurrentPages()
    let currentPage = pages[pages.length-1]
    const {type} = currentPage.options
    // 选中标题
    this.changeTitleByIndex(type-1)
    this.getOrders(type)

  },
  // 获取订单列表的方法
  async getOrders(type){
    const res = await mpRequest({ url:'/my/orders/all',data:{type}})
    this.setData({
      orders:res.orders
    })
  }
})
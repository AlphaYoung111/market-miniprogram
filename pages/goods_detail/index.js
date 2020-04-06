// pages/goods_detail/index.js
import {
  mpRequest
} from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 商品详情数据
    goodsObj: {},
    // 判断是否收藏 
    isCollect:false
  },
  // 完整的商品信息
  GoodsInfo: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function() {
    let pages = getCurrentPages()
    let currentPages = pages[pages.length-1]
    let options = currentPages.options
    const goods_id = options.goods_id
    this.getGoodsDetail(goods_id)


  },
  // 请求数据
  async getGoodsDetail(goods_id) {
    const {
      data
    } = await mpRequest({
      url: '/goods/detail',
      data: {
        goods_id
      }
    })
    this.GoodsInfo = data
    // 收藏的逻辑
    let collect = wx.getStorageSync('collect') || []
    let isCollect = collect.some(item => item.message.goods_id === this.GoodsInfo.message.goods_id)
    this.setData({
      goodsObj: {
        goods_name: data.message.goods_name,
        goods_price: data.message.goods_price,
        // 处理iPhone 不识别webp格式，（需要后台处理）
        goods_introduce: data.message.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: data.message.pics,
      },
      isCollect
    })
  },
  // 轮播图预览
  handlePreviewImg(e) {
    const urls = this.GoodsInfo.message.pics.map(item => item.pics_mid)
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: urls,

    })
  },
  // 添加购物车
  handleCartAdd() {
    let cart = wx.getStorageSync('cart') || []
    let index = cart.findIndex(item => item.goods_id === this.GoodsInfo.message.goods_id)
    if (index === -1) {
      this.GoodsInfo.num = 1
      this.GoodsInfo.checked= true
      cart.push(this.GoodsInfo)
    } else {
      cart[index].num++
    }
    wx.setStorageSync('cart', cart)
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true
    })
  },
  // 点击添加收藏
  handleCollect(){
    let isCollect = false
    let collect = wx.getStorageSync('collect')||[]
    let index = collect.findIndex(item=>item.message.goods_id===this.GoodsInfo.message.goods_id)
    if(index!==-1){
      collect.splice(index,1)
      isCollect =false
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask:true
      })
    }else{
      collect.push(this.GoodsInfo)
      isCollect=true
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      })
    }
    wx.setStorageSync('collect', collect)
    this.setData({
      isCollect
    })
  }
})
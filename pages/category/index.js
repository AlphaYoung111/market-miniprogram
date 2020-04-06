// pages/category/index.js
import {
  mpRequest
} from '../../request/index.js';
import regeneratorRuntime  from '../../lib/runtime/runtime.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 左侧数据
    leftMenuList: [],
    // 右侧数据
    rightContent: [],
    // 被点击的菜单
    currentIndex: 0,
    // 右侧区域滚动的位置
    scrollTop: 0
  },
  // 所有数据
  allData: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 减少重复请求数据，在本地可以存储一下数据
    const Cates = wx.getStorageSync("cates")
    if (!Cates) {
      this.getCategory()
    } else {
      if (Date.now() - Cates.time > 1000 * 10) {
        this.getCategory()
      } else {
        this.allData = Cates.data
        let leftMenuList = this.allData.map(item => item.cat_name)
        let rightContent = this.allData[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
  // 获取分类数据
  async getCategory() {
    let res = await mpRequest({
      url: '/categories'
    })
    this.allData = res.data.message
    // 存入本地数据，减少请求
    wx.setStorageSync("cates", {
      time: Date.now(),
      data: this.allData
    })

    let leftMenuList = this.allData.map(item => item.cat_name)
    let rightContent = this.allData[0].children
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  // 点击左边改变索引
  changeIndex(e) {
    const {
      index
    } = e.currentTarget.dataset
    let rightContent = this.allData[index].children
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0
    })
  }
})
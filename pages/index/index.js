import {
  mpRequest
} from '../../request/index.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航数组
    cateList: [],
    // 楼层数组
    floorList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getSwiperList()
    this.getCateList()
    this.getFloorList()
  },

  // 获取轮播图数据
  getSwiperList() {
    mpRequest({
      url: '/home/swiperdata'
    }).then(res => {
      this.setData({
        swiperList: res.data.message
      })
    })
  },
  // 获取导航数据
  getCateList() {
    mpRequest({
      url: '/home/catitems'
    }).then(res => {
      this.setData({
        cateList: res.data.message
      })
    })
  },
  // 获取楼层数据
  getFloorList(){
    mpRequest({
      url:'/home/floordata'
    }).then(res=>{
      this.setData({
        floorList:res.data.message
      })
    })
  }
})
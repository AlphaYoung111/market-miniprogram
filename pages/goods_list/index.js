// pages/goods_list/index.js
import {
  mpRequest
} from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {id:0,value:'综合',isActive:true},
      {id:1,value:'销量',isActive:false},
      {id:2,value:'价格',isActive:false},
    ],
    // 页面数据
    goodsList:[]
  },
  // 请求参数
  QueryParams:{
    query:'',
    cid:'',
    pagenum:1,
    pagesize:10
  },
  // 总页数
  totalPages:1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid || ""
    this.QueryParams.query = options.query || ""
    this.getGoodsList()
  },
  // 获取列表数据
  async getGoodsList(){
    let res = await mpRequest({
      url: '/goods/search',
      data: this.QueryParams
    })
    const total =res.data.message.total
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize)
    this.setData({
      goodsList: [...this.data.goodsList,...res.data.message.goods]
    })
  },
  // 选项卡点击事件
  handleTabsItemChange(e){
    const {index} = e.detail
    let {tabs} = this.data
    tabs.forEach((item,i)=>i===index?item.isActive=true:item.isActive=false)
    this.setData({tabs})
  },
  // 触底刷新事件
  onReachBottom(){
    if(this.QueryParams.pagenum>=this.totalPages){
      wx.showToast({
        title: '没有下一页数据了',
        icon:'none'
      })
    }else{
      this.QueryParams.pagenum++
      this.getGoodsList()
    }
  },
  // 上拉刷新
  onPullDownRefresh(){
    this.setData({
      goodsList:[]
    })
    this.QueryParams.pagenum = 1
    this.getGoodsList()
    if(this.data.goodsList!=[]){
      wx.stopPullDownRefresh()
    }
  }
  

})
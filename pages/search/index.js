// pages/search/index.js
import {
  mpRequest
} from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 搜索数据
    goods:[],
    // 取消按钮是否显示
    isFocus:false,
    // 输入框的值
    inpValue:""
  },
  TimeId:-1,
  // 输入框事件
  handleInput(e){
    const {value} = e.detail
    // 是否为空
    if(!value.trim()){
      this.setData({
        goods:[],
        isFocus:false
      })
      return
    }
    this.setData({
      isFocus:true
    })
    clearTimeout(this.TimeId)
    this.TimeId = setTimeout(()=>{
      this.qsearch(value)
    },500)
  },
  // 发送搜索请求
  async qsearch(query){
    const res = await mpRequest({ url:'/goods/qsearch',data:{query}})
    this.setData({
      goods:res.data.message
    })
  },
  // 点击取消按钮
  handleCancle(){
    this.setData({
      inpValue:"",
      goods:[],
      isFocus:false
    })
  }
})
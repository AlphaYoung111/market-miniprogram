// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:'体验问题',
        isActive:true
      },
      {
        id: 1,
        value: '商品丶商家投诉',
        isActive: false
      }
    ],
    // 选中图片的数据
    chooseImgs:[],
    // 文本域内容
    textVal:""
  },
  UpLoadImgs:[],
  // 点击选项卡
  hanleTabsItemChange(e){
    const {index} = e.detail
    let {tabs} = this.data
    tabs.forEach((item,i)=>i===index?item.isActive=true:item.isActive=false)
    this.setData({tabs})
  },
  // 选择图片
  handleImgChoose() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          chooseImgs: [...this.data.chooseImgs, ...res.tempFilePaths]
        })
      }
    })
  },
  // 删除选中图片
  handleRemoveImg(e){
    const {index} = e.currentTarget.dataset
    let {chooseImgs} = this.data
    chooseImgs.splice(index,1)
    this.setData({
      chooseImgs
    })
  },
  // 文本域输入事件
  handleTextInput(e){
    this.setData({
      textVal:e.detail.value
    })
  },
  // 提交按钮的点击事件
  handleFormSubmit(e){
    const {textVal,chooseImgs} = this.data
    if(!textVal.trim()){
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true
      })
      return
    }
    // 上传
    chooseImgs.forEach((item,index)=>{
      wx.uploadFile({
        url: '',
        filePath: item,
        name: 'file', 
        success: function(res) {},
      })
    })
  }
})
//index.js
//获取应用实例
const app = getApp()
const weatherKey = '705b08a46c9f2fefb7994f17151b828e'
const wxCharts = require('../../utils/wxcharts-min.js');
import { getDateStr} from '../../utils/util.js'

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    weatherData:{},
    tomorrow:{},
    tomorrowImgsrc:'',
    dayAfterTomorrow:{},
    dayAfterTomorrowImgSrc:'',
    futureData:[],
    showDressingAdvice:1,
    display:'block',
    shoExerciseAdvice:0,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.getLocation()
    this.timer()
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  /**
   * 获取用户信息
   */
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
   * 定时器
   */
  timer:function(){
    let _this = this
    return setInterval(() => {
      _this.setData({
        showDressingAdvice: _this.data.showDressingAdvice === 0 ? 1 : 0,
        display: _this.data.display === 'block' ? 'none' : 'block',
        shoExerciseAdvice: _this.data.shoExerciseAdvice === 0 ? 1 : 0,
      })
    }, 5000)
  },
  /**
   * 获取数据
   */
  getWeatherData: function (cityname = "上海", lon = "116.39277", lat ="39.933748"){
   let _this = this
   wx.request({
     url: `https://v.juhe.cn/weather/geo?lon=${lon}&lat=${lat}8&dtype=&format=&key=${weatherKey}`,
     method:'GET',
     data:{},
     header:{
       'Accept':'application/json'
     },
     success:(res) => {
       console.log(res)
       _this.setData({
         weatherData: res.data.result,
         tomorrow: _this.getTomorrow(res.data.result),
         dayAfterTomorrow: _this.getDayAfterTomorrow(res.data.result),
         futureData:_this.getFutureData(res.data.result.future)
       })
     }
   })
  },
  /**
   * 获取明天的数据
   */
  getTomorrow:function(data){
    const dataStr = getDateStr(1)
    const tomorrow = data.future[`day_${dataStr}`]
    this.setData({
      tomorrowImgsrc:`../../static/img/weather/${tomorrow.weather_id.fa}.png`
    })
    return tomorrow
  },
  /**
   * 获取后天的数据
   */
  getDayAfterTomorrow:function(data){
    const dataStr = getDateStr(2)
    const dayAfterTomorrow = data.future[`day_${dataStr}`]
    this.setData({
      dayAfterTomorrowImgSrc: `../../static/img/weather/${dayAfterTomorrow.weather_id.fa}.png`
    })
    return dayAfterTomorrow
  },
  /**
   * 获取位置
   */
  getLocation: function(){
    let _this = this
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        _this.getWeatherData('上海', longitude, latitude)
      }
    })
  },
  /**
   * 获取未来七天的天气
   */
  getFutureData: function (futureData){
    let data = []
    let result = []
    for (let i in futureData){
      result.push(futureData[i])
    }
    result.forEach((item)=>{
      data.push({
        ...item,
        date: `${item.date.substring(4, 6)}/${item.date.substring(6, 8)}`,
        lTemp: item.temperature.split('~')[0],
        hTemp: item.temperature.split('~')[1],
        weatherImg: `../../static/img/weather/${item.weather_id.fa}.png`
      })
    })
    return data
  }
})

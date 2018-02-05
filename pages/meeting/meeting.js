//index.js
const api = require('../../utils/api')
const util = require('../../utils/util')
const Wxmlify = require('../../wxmlify/wxmlify.js')
const app = getApp()

Page({
  data: {
    id: -1,
    title: '',
    cover_small_url: '',
    address: '',
    started_at: '',
    finished_at: '',
    lat: 31.791235,
    lng: 117.27303,
    is_require_charge: false,
    charge: 0,
    is_signed: false,
    is_checked: false,

    isLoaded: false,
    isShowDescription: false
  },

  onLoad(options) {
    this.setData({ id: options.id })
  },

  loadData() {
    if (!app.globalData.accessKey) {
      setTimeout(this.loadData.bind(this), 200)
      return
    }
    api.getMeeting(this.data.id).then(res => {
      const {
        title,
        cover_small_url,
        address,
        started_at,
        finished_at,
        lat, lng,
        is_require_charge,
        charge
      } = res.data.data

      const {
        is_signed, is_checked
      } = res.data.meta

      new Wxmlify(res.data.data.description, this, {
        dataKey: 'nodes',
      })

      const markers = [{
        iconPath: "/images/icon_marker.png",
        latitude: lat,
        longitude: lng,
        width: 30,
        height: 30
      }]

      this.setData({
        title,
        cover_small_url,
        address,
        started_at,
        finished_at,
        lat,
        lng,
        is_require_charge,
        charge,
        loaded: true,
        markers,
        is_signed,
        is_checked
      })
    })
  },

  onReady() {
    this.loadData()
  },

  showDescription(e) {
    this.setData({
      isShowDescription: true
    })
  },

  handleSignUp(e) {
    api.signUpMeeting(this.data.id)
      .then(res => {
        wx.showToast({
          'title': '报名成功'
        })
        this.setData({ is_signed: true })
      })
  },

  hanldeCheckIn(e) {
    const checkIn = () => {
      wx.getLocation({
        type: 'wgs84',
        success: (res) => {
          const distance = util.calcDistance(res.latitude, res.longitude, this.data.lat, this.data.lng)
          if (distance > 500) {
            wx.showToast({
              title: '需要在活动定位的附近才可以签到',
              icon: 'none',
              duration: 2000
            })
          } else {
            api.checkInMeeting(this.data.id)
              .then(res => {
                wx.showToast({
                  title: '签到成功',
                  icon: 'success'
                })
                this.setData({ is_checked: true })
              })
              .catch(error => {
                wx.showToast({
                  title: error.data.message,
                  icon: 'none'
                })
              })
          }
        }
      })
    }

    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.showModal({
            title: '提示',
            content: '签到功能基于地理位置接口，需要授权读取地理位置',
            success: function(res) {
              if (res.confirm) {
                wx.authorize({
                  scope: 'scope.userLocation',
                  success() {
                    checkIn()
                  }
                })
              }
            }
          })
        }
        else {
          checkIn()
        }
      }
    })
  }
})
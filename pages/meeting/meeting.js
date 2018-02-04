//index.js
const api = require('../../utils/api.js')
const Wxmlify = require('../../wxmlify/wxmlify.js')

Page({
  data: {
    title: '',
    cover_small_url: '',
    address: '',
    started_at: '',
    finished_at: '',
    lat: 31.791235,
    lng: 117.27303,
    is_require_charge: false,
    charge: 0,

    isLoaded: false,
    isShowDescription: false,
  },

  onLoad(options) {
    api.getMeeting(options.id)
      .then(res => {
        const data = res.data.data
        const { 
          title,
          cover_small_url,
          address,
          started_at,
          finished_at,
          lat, lng,
          is_require_charge,
          charge
        } = data

        new Wxmlify(data.description, this, {
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
          markers
        })
      })
  },

  showDescription(e) {
    this.setData({
      isShowDescription: true
    })
  },

  handleSignUp(e) {
    console.log(e);
  },

  hanldeCheckIn(e) {
    console.log(e);
  }
})
const api = require('../../utils/api.js')
const app = getApp()

Page({
  data: {
    meetings: []
  },

  onLoad() {
    const accessKey = app.globalData.accessKey
    api.getSignedMeetings(accessKey)
      .then(res => {
        const meetings = res.data.data
        this.setData({ meetings })
      })
  }
})
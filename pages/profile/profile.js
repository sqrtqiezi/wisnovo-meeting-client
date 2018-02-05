const api = require('../../utils/api')

Page({
  data: {
    meetings: []
  },

  onLoad() {
    console.log('on load')
  },

  onReady() {
    api.getSignedMeetings()
      .then(res => {
        const meetings = res.data.data
        this.setData({ meetings })
      })
  },

  onShow() {
    console.log('on show')
  }
})
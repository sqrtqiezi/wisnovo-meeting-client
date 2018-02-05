//app.js
const api = require('./utils/api')

App({
  onLaunch: function () {
    api.checkLogin().then(res => {
      this.globalData.sessionKey = res.data.session_key;
      this.globalData.accessKey = res.data.access_key;
    })
  },
  globalData: {
    sessionKey: null,
    accessKey: null
  }
})
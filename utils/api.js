const baseUrl = 'http://meeting.local'

function getAllMeetings(page = 1) {
  const api = `${baseUrl}/api/meetings?page=${page}`
  return new Promise((resolve, reject) => {
    wx.showLoading({ title: '加载中...', mask: true })
    wx.request({
      url: api,
      header: {
        'content-type': 'application/json',
        'Accept': 'application/prs.wisnovo-meetings.v1+json'
      },
      success: function(res) {
        if (res.statusCode === 200) {
          resolve(res)
        } else {
          reject(res)
        }
      },
      fail: function(error) {
        reject(error)
      },
      complete: function() {
        wx.hideLoading()
      }
    })
  })
}

module.exports = {
  getAllMeetings
}
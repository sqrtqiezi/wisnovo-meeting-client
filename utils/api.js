const BASE_URL = 'http://meeting.local'

const BASE_HEADER = {
  'content-type': 'application/json',
  'Accept': 'application/prs.wisnovo-meetings.v1+json'
}

function baseRequest(api, header, successCode = 200) {
  return new Promise((resolve, reject) => {
    wx.showLoading({ title: '加载中...', mask: true })
    wx.request({
      url: api,
      header: {
        ...BASE_HEADER,
        ...header
      },
      success: function(res) {
        if (res.statusCode === successCode) {
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

function getAllMeetings(page = 1) {
  const api = `${BASE_URL}/api/meetings?page=${page}`
  return baseRequest(api)
}

function getMeeting(id) {
  const api = `${BASE_URL}/api/meetings/${id}`
  return baseRequest(api)
}

module.exports = {
  getAllMeetings,
  getMeeting
}
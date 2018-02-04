const BASE_URL = 'http://meeting.local'

const BASE_HEADER = {
  'content-type': 'application/json',
  'Accept': 'application/prs.wisnovo-meetings.v1+json'
}

function baseRequest(api, header, method = 'GET', successCode = 200) {
  return new Promise((resolve, reject) => {
    wx.showLoading({ title: '加载中...', mask: true })
    wx.request({
      url: api,
      header: {
        ...BASE_HEADER,
        ...header
      },
      method,
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

function signUpMeeting(id, accessKey) {
  const api = `${BASE_URL}/api/meetings/${id}/sign-up`
  return baseRequest(api, {
    'Authorization': `Bearer ${accessKey}`
  }, 'PUT')
}

function getSignedMeetings(accessKey) {
  const api = `${BASE_URL}/api/signed-meetings`
  return baseRequest(api, {
    'Authorization': `Bearer ${accessKey}`
  })
}

function checkLogin() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: `${BASE_URL}/api/mini_program/login`,
            data: {
              code: res.code
            },
            success: function(res) {
              if (!!res.data.session_key) {
                resolve(res)
              } else {
                console.log('获取用户登录态失败！', res)
              }
            }
          })
        } else {
          console.log('获取用户登录态失败！', res)
        }
      }
    })
  })
}

module.exports = {
  getAllMeetings,
  getMeeting,
  signUpMeeting,
  getSignedMeetings,
  checkLogin
}
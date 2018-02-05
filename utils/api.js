//utils/api.js
const BASE_URL = 'http://meeting.local'
const BASE_HEADER = {
  'content-type': 'application/json',
  'Accept': 'application/prs.wisnovo-meetings.v1+json'
}

function baseRequest(api, method = 'GET', successCode = 200) {
  const app = getApp()
  let isRetried = false

  const doRequest = (resolve, reject) => {
    const accessKey = app.globalData.accessKey
    const header = {
      ...BASE_HEADER,
      'Authorization': `Bearer ${accessKey}`
    }
    wx.request({
      url: api,
      header, method,
      success(res) {
        if (res.statusCode === successCode) {
          resolve(res)
        } else if(res.statusCode === 401 && !isRetried) {
          // 仅可重试一次 request 请求
          isRetried = true;
          refreshAccessToken(() => {
            doRequest(resolve, reject)
          }, reject)
        } else {
          reject(res)
        }
      },
      fail(error) {
        reject(error)
      },
      complete() {
        wx.hideLoading()
      }
    })
  }

  const refreshAccessToken = (resolve, reject) => {
    const accessKey = app.globalData.accessKey
    const header = {
      ...BASE_HEADER,
      'Authorization': `Bearer ${accessKey}`
    }
    wx.request({
      url: `${BASE_URL}/api/authorizations/current`,
      header,
      method: 'PUT',
      success(res) {
        if (res.statusCode === 200) {
          app.globalData.accessKey = res.data.access_token
          resolve(res)
        } else {
          reject(res)
        }
      },
      fail(error) {
        reject(error)
      }
    })
  }

  return new Promise((resolve, reject) => {
    wx.showLoading({ title: '加载中...', mask: true })
    doRequest(resolve, reject)
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

function signUpMeeting(id) {
  const api = `${BASE_URL}/api/meetings/${id}/sign-up`
  return baseRequest(api, 'PUT', 204)
}

function checkInMeeting(id) {
  const api = `${BASE_URL}/api/meetings/${id}/check-in`
  return baseRequest(api, 'PUT', 204)
}

function getSignedMeetings() {
  const api = `${BASE_URL}/api/signed-meetings`
  return baseRequest(api)
}

function checkLogin() {
  return new Promise((resolve, reject) => {
    wx.showLoading({ title: '登录中...', mask: true })
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
            },
            complete: function(res) {
              wx.hideLoading()
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
  checkInMeeting,
  getSignedMeetings,
  checkLogin
}
//index.js
const api = require('../../utils/api.js')
const app = getApp()

Page({
  data: {
    meetings: [],
    currentPage: 0,
    totalPages: 1
  },

  onLoad: function () {
    this.loadMoreMeetings()
  },

  loadMoreMeetings() {
    if (this.data.currentPage >= this.data.totalPages) {
      return
    }
    const page = this.data.currentPage + 1
    api.getAllMeetings(page)
      .then(res => {
        const meetings = [
          ...this.data.meetings,
          ...res.data.data
        ]
        const totalPages = res.data.meta.pagination.total_pages
        
        this.setData({ 
          meetings,
          currentPage: page,
          totalPages
        })
      })
  }
})

import axios from 'axios'

// const serverUrl = 'http://localhost:8080'
const serverUrl = 'http://localhost:8080'
const debug = false

export default {
  D: debug ? console.log : () => {},
  serverUrl: serverUrl,
  isEmptyObject: function (obj) {
    for (let n in obj) {
      return false
    }
    return true
  },
  url: function (path, params = {}) {
    if (this.isEmptyObject(params)) {
      return serverUrl + path
    } else {
      let query = ''
      let index = 0
      for (let n in params) {
        this.D(params[n])
        if (params[n] == null || (params[n] instanceof String && params[n].length === 0)) {
          continue
        }
        if (index > 0) {
          query += '&'
        }
        index++
        if (Array.isArray(params[n])) {
          this.D('发现数组')
          this.D(params[n])
          let idx = 0
          for (let p in params[n]) {
            if (idx > 0) {
              query += '&'
            }
            idx++
            query += `${n}=${params[n][p]}`
          }
        } else {
          query += `${n}=${params[n]}`
        }
      }
      return serverUrl + path + '?' + query
    }
  },
  get: function (path, params = {}) {
    return axios({
      method: 'get',
      withCredentials: true,
      url: this.url(path, params)
    })
  },
  post: function (path, params = {}, data = {}) {
    return axios({
      method: 'post',
      withCredentials: true,
      url: this.url(path, params),
      data: data
    })
  },
  put: function (path, params = {}, data = {}) {
    return axios({
      method: 'put',
      withCredentials: true,
      url: this.url(path, params),
      data: data
    })
  },
  delete: function (path, params = {}) {
    return axios({
      method: 'delete',
      withCredentials: true,
      url: this.url(path, params)
    })
  },
  getTimeStr: function (timestamp, type = 'zh') {
    let date = new Date(timestamp)
    if (type === 'zh') {
      return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日'
    } else if (type === '-') {
      let month = date.getMonth() + 1
      month = month.length === 1 ? month : '0' + month
      let day = date.getDate()
      return date.getFullYear() + '-' + month + '-' + day + '-'
    }
  },
  getHourTime: function (timestamp) {
    let date = new Date(timestamp)
    let hour = date.getHours().toString()
    hour = hour.length > 1 ? hour : '0' + hour
    let minute = date.getMinutes().toString()
    minute = minute.length > 1 ? minute : '0' + minute
    return hour + ':' + minute
  }

}

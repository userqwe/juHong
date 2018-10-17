import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
// import { getToken } from '@/utils/auth'
import router from '@/router'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if (!store.getters.token) {
    router.push('/login')
  }
  // config.headers['token'] = store.getters.token
  // if (store.getters.token) {
  //   config.headers['token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  // }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    // token失效
    if (res.code === 50008) {
      MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          router.push('/login')
        })
      })
    }
    // 接口错误
    if ((+res.code) !== 200) {
      Message({
        message: res.message || res.error_msg || '未知错误',
        type: 'error',
        duration: 3 * 1000,
        onClose: () => {
          // location.reload()
        }
      })
      return Promise.reject('error')
    }
    // 接口错误
    if (res.data.error_code) {
      Message({
        message: res.data.error_msg,
        type: 'error',
        duration: 3 * 1000,
        onClose: () => {
          location.reload()
        }
      })
      return Promise.reject('error')
    }
    return response.data
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service


// 用于存放请求文件
import axios from 'axios'

// axios.create用于创建一个axios实例，该实例和axios的功能一样
// 归根到底也就是克隆了一个axios
// 为什么这么做： 这样的话可以拥有多个不同的请求函数，而他们的配置可能是不一样的
const request = axios.create({
  baseURL: 'http://toutiao.course.itcast.cn '
})

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Do something with response data
  return response
}, function (error) {
  // Do something with response error
  return Promise.reject(error)
})

export default request

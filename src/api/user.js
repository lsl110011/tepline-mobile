// 用户相关接口封装模块

// 建议将所有请求都封装成一个个小函数，在需要时直接调用
// 好处：1 好维护，统一管理 2 可重用
// 遵循原则：不要直接在组件中发请求，都封装成函数进行调用

import request from '@/utils/request'

export const login = ({ mobile, code }) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data: {
      mobile,
      code
    }
  })
}

// 没有其他逻辑可以一步简写
// export const login = ({}) => request({
//   mothod: 'POST',
//   url: '/app/v1_0/authorizations',
//   data: {
//     mobile,
//     code
//   }
// })

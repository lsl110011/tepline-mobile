// 频道相关接口封装模块

import request from '@/utils/request'
// 获取首页频道列表
// 已登录（携带token）: 用户频道列表
// 未登录: 推荐频道列表
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}

// 获取所有频道列表
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}

// 删除用户指定频道
export const deleteUserChannel = channelId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/channels/${channelId}`
  })
}

// 批量修改用户频道列表（部分覆盖）
// channel[]
// {id:频道id, seq:频道的序号}
// 后端在保存用户频道的时候为每个频道设置了一个序号，从一开始
// "推荐"频道不参与序号的排列
export const updateUserChannel = channels => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/channels',
    data: {
      channels
    }
  })
}

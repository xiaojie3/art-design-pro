import request from '@/utils/http'

// 获取用户列表
export function fetchGetUserPage(params: Api.SystemManage.UserSearchParams) {
  return request.get<Api.SystemManage.UserPage>({
    url: '/api/system/user/query',
    params
  })
}
export function fetchSaveUser(params: Api.SystemManage.UserSaveParams) {
  return request.post({
    url: '/api/system/user',
    params
  })
}
export function fetchDeleteUser(id: string) {
  return request.del({
    url: '/api/system/user',
    params: { id }
  })
}

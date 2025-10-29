import request from '@/utils/http'
import { AppRouteRecord } from '@/types/router'

// 获取用户列表
export function fetchFindUserPage(params: Api.SystemManage.UserSearchParams) {
  return request.post<Api.SystemManage.UserList>({
    url: '/api/user/query',
    params
  })
}

// 获取角色列表
export function fetchGetRoleList(params: Api.SystemManage.RoleSearchParams) {
  return request.get<Api.SystemManage.RoleList>({
    url: '/api/role',
    params
  })
}

// 新增角色
export function fetchAddRole(params: Api.SystemManage.RoleListItem) {
  return request.post<Api.SystemManage.RoleListItem>({
    url: '/api/role',
    params
  })
}
// 编辑角色
export function fetchUpdateRole(params: Api.SystemManage.RoleListItem) {
  return request.put<Api.SystemManage.RoleListItem>({
    url: '/api/role',
    params
  })
}

// 获取菜单列表
export function fetchGetMenuList() {
  return request.get<AppRouteRecord[]>({
    url: '/api/menu'
  })
}

import request from '@/utils/http'
import { AppRouteRecord } from '@/types/router'

// 获取用户列表
export function fetchGetUserPage(params: Api.SystemManage.UserSearchParams) {
  return request.post<Api.SystemManage.UserPage>({
    url: '/api/system/user/query',
    params
  })
}

// 角色级联选择器选项
export function fetchRoleCascaderOptionsList() {
  return request.get<Api.Common.CascaderOptionsItem[]>({
    url: '/api/system/role-group/cascader'
  })
}

// 获取角色列表
export function fetchGetRoleList(params: Api.SystemManage.RoleSearchParams) {
  return request.get<Api.SystemManage.RoleList>({
    url: '/api/role/list',
    params
  })
}

// 获取菜单列表
export function fetchGetMenuList() {
  return request.get<AppRouteRecord[]>({
    url: '/api/v3/system/menus/simple'
  })
}

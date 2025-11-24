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
  return request.post<Api.SystemManage.RoleList>({
    url: '/api/system/role/query',
    params
  })
}
// 保存角色
export function fetchSaveRole(params: Api.SystemManage.RoleListItem) {
  return request.post<Api.SystemManage.RoleList>({
    url: '/api/system/role/save',
    params
  })
}
// 删除角色
export function fetchDeleteRole(params: string[]) {
  return request.post<void>({
    url: '/api/system/role/delete',
    params
  })
}
// 获取角色菜单列表
export function fetchGetRoleMenuList(roleId: string) {
  return request.get<AppRouteRecord[]>({
    url: '/api/system/menu/tree/role',
    params: { roleId }
  })
}
// 获取用户菜单列表
export function fetchGetUserMenuList() {
  return request.get<AppRouteRecord[]>({
    url: '/api/system/menu/tree/user'
  })
}

// 获取全部菜单列表
export function fetchGetMenuList() {
  return request.get<AppRouteRecord[]>({
    url: '/api/system/menu/tree'
  })
}

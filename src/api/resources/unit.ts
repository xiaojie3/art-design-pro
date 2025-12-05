import request from '@/utils/http'

export function fetchGetUnitTree() {
  return request.get<Api.Common.TreeItem[]>({
    url: '/api/res/unit/tree'
  })
}
// 获取学院列表
export function fetchGetUnitPage(params: Api.ResourcesManage.UnitSearchParams) {
  return request.get<Api.ResourcesManage.UnitPage>({
    url: '/api/res/unit/query',
    params
  })
}
// 获取学院列表
export function fetchGetUnitList() {
  return request.get<Api.ResourcesManage.UnitItem[]>({
    url: '/api/res/unit/list'
  })
}
// 获取学院信息
export function fetchGetUnit(id: string) {
  return request.get<Api.ResourcesManage.UnitItem>({
    url: '/api/res/unit/get',
    params: { id }
  })
}
// 保存学院信息
export function fetchSaveUnit(params: Api.ResourcesManage.UnitItem) {
  return request.post<Api.ResourcesManage.UnitItem>({
    url: '/api/res/unit/save',
    params
  })
}
export function fetchDeleteUnit(params: string[]) {
  return request.post({
    url: '/api/res/unit/delete',
    params
  })
}

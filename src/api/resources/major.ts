import request from '@/utils/http'

export function fetchGetMajorTree() {
  return request.get<Api.Common.TreeItem[]>({
    url: '/api/res/major/tree'
  })
}
// 获取学院列表
export function fetchGetMajorPage(params: Api.ResourcesManage.MajorSearchParams) {
  return request.get<Api.ResourcesManage.MajorPage>({
    url: '/api/res/major/query',
    params
  })
}
// 获取学院列表
export function fetchGetMajorList(params: Api.ResourcesManage.MajorSearchParams) {
  return request.get<Api.Common.OptionItem[]>({
    url: '/api/res/major/list',
    params
  })
}
// 获取学院信息
export function fetchGetMajor(id: string) {
  return request.get<Api.ResourcesManage.MajorItem>({
    url: '/api/res/major/get',
    params: { id }
  })
}
// 保存学院信息
export function fetchSaveMajor(params: Api.ResourcesManage.MajorItem) {
  return request.post<Api.ResourcesManage.MajorItem>({
    url: '/api/res/major/save',
    params
  })
}
export function fetchDeleteMajor(params: string[]) {
  return request.post({
    url: '/api/res/major/delete',
    params
  })
}

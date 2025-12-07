import request from '@/utils/http'

export function fetchGetClassTree() {
  return request.get<Api.Common.TreeItem[]>({
    url: '/api/res/class/tree'
  })
}
// 获取班级列表
export function fetchGetClassPage(params: Api.ResourcesManage.ClassSearchParams) {
  return request.get<Api.ResourcesManage.ClassPage>({
    url: '/api/res/class/query',
    params
  })
}
// 获取班级列表
export function fetchGetClassList() {
  return request.get<Api.Common.OptionItem[]>({
    url: '/api/res/class/list'
  })
}
// 获取班级信息
export function fetchGetClass(id: string) {
  return request.get<Api.ResourcesManage.ClassItem>({
    url: '/api/res/class/get',
    params: { id }
  })
}
// 保存班级信息
export function fetchSaveClass(params: Api.ResourcesManage.ClassItem) {
  return request.post<Api.ResourcesManage.ClassItem>({
    url: '/api/res/class/save',
    params
  })
}
export function fetchDeleteClass(params: string[]) {
  return request.post({
    url: '/api/res/class/delete',
    params
  })
}

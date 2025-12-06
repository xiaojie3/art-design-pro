import request from '@/utils/http'
export function fetchGetCollegeTree() {
  return request.get<Api.Common.TreeItem[]>({
    url: '/api/res/college/tree'
  })
}
// 获取学院列表
export function fetchGetCollegePage(params: Api.ResourcesManage.CollegeSearchParams) {
  return request.get<Api.ResourcesManage.CollegePage>({
    url: '/api/res/college/query',
    params
  })
}
// 获取学院列表
export function fetchGetCollegeList() {
  return request.get<Api.ResourcesManage.CollegeItem[]>({
    url: '/api/res/college/list'
  })
}
// 获取学院信息
export function fetchGetCollege(id: string) {
  return request.get<Api.ResourcesManage.CollegeItem>({
    url: '/api/res/college/get',
    params: { id }
  })
}
// 保存学院信息
export function fetchSaveCollege(params: Api.ResourcesManage.CollegeItem) {
  return request.post<Api.ResourcesManage.CollegeItem>({
    url: '/api/res/college/save',
    params
  })
}
export function fetchDeleteCollege(params: string[]) {
  return request.post({
    url: '/api/res/college/delete',
    params
  })
}

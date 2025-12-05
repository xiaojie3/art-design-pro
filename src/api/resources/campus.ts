import request from '@/utils/http'
// 获取校区列表
export function fetchGetCampusPage(params: Api.ResourcesManage.CampusSearchParams) {
  return request.get<Api.ResourcesManage.CampusPage>({
    url: '/api/res/campus/query',
    params
  })
}
// 获取校区列表
export function fetchGetCampusList() {
  return request.get<Api.ResourcesManage.CampusItem[]>({
    url: '/api/res/campus/list'
  })
}
// 获取校区信息
export function fetchGetCampus(id: string) {
  return request.get<Api.ResourcesManage.CampusItem>({
    url: '/api/res/campus/get',
    params: { id }
  })
}
// 保存校区信息
export function fetchSaveCampus(params: Api.ResourcesManage.CampusItem) {
  return request.post<Api.ResourcesManage.CampusItem>({
    url: '/api/res/campus/save',
    params
  })
}
export function fetchDeleteCampus(params: string[]) {
  return request.post({
    url: '/api/res/campus/delete',
    params
  })
}

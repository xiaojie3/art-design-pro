import request from '@/utils/http'

// 获取校区列表
export function fetchFindCampusPage(params: Api.ResourceManage.CampusSearchParams) {
  return request.post<Api.ResourceManage.CampusList>({
    url: '/api/resource/campus/query',
    params
  })
}
// 添加校区
export function fetchAddCampus(params: Api.ResourceManage.CampusListItem) {
  return request.post<Api.ResourceManage.CampusListItem>({
    url: '/api/resource/campus',
    params
  })
}
// 编辑校区
export function fetchEditCampus(params: Api.ResourceManage.CampusListItem) {
  return request.put<Api.ResourceManage.CampusListItem>({
    url: '/api/resource/campus',
    params
  })
}
// 删除校区
export function fetchDeleteCampus(params: Api.ResourceManage.CampusListItem) {
  return request.del<void>({
    url: '/api/resource/campus',
    params
  })
}
// 获取学院列表
export function fetchFindCollegePage(params: Api.ResourceManage.CollegeSearchParams) {
  return request.post<Api.ResourceManage.CollegeList>({
    url: '/api/resource/college/query',
    params
  })
}

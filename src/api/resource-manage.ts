import request from '@/utils/http'

// 获取校区列表
export function fetchFindCampusPage(params: Api.ResourceManage.CampusSearchParams) {
  return request.post<Api.ResourceManage.CampusList>({
    url: '/api/resource/campus/query',
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

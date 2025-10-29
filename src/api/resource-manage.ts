import request from '@/utils/http'

// 获取角色列表
export function fetchGetCollegePage(params: Api.ResourceManage.CollegeSearchParams) {
  return request.post<Api.ResourceManage.CollegeList>({
    url: '/api/resource/college/query',
    params
  })
}

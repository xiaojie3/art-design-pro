import request from '@/utils/http'
// 获取学校信息
export function fetchGetSchool() {
  return request.get<Api.ResourcesManage.SchoolItem>({
    url: '/api/base/school'
  })
}
// 编辑学校信息
export function fetchEditSchool(params: Api.ResourcesManage.SchoolItem) {
  return request.post<Api.ResourcesManage.SchoolItem>({
    url: '/api/base/school',
    showSuccessMessage: true,
    params
  })
}

import request from '@/utils/http'
// 获取学校列表
export function fetchGetSchoolList() {
  return request.get<Api.ResourcesManage.SchoolItem[]>({
    url: '/api/resource/school/list'
  })
}
// 获取学校信息
export function fetchGetSchool() {
  return request.get<Api.ResourcesManage.SchoolItem>({
    url: '/api/resource/school/get'
  })
}
// 编辑学校信息
export function fetchEditSchool(params: Api.ResourcesManage.SchoolItem) {
  return request.post<Api.ResourcesManage.SchoolItem>({
    url: '/api/resource/school/save',
    showSuccessMessage: true,
    params
  })
}

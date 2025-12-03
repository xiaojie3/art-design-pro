import request from '@/utils/http'
// 获取学校列表
export function fetchGetSchoolList() {
  return request.get<Api.ResourcesManage.SchoolList>({
    url: '/api/resource/school'
  })
}
// 获取学校信息
export function fetchGetSchool() {
  return request.get<Api.ResourcesManage.SchoolListItem>({
    url: '/api/resource/school'
  })
}
// 编辑学校信息
export function fetchEditSchool(params: Api.ResourcesManage.SchoolListItem) {
  return request.put<Api.ResourcesManage.SchoolListItem>({
    url: '/api/resource/school',
    showSuccessMessage: true,
    params
  })
}

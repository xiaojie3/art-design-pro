import request from '@/utils/http'

export function fetchGetClassTree() {
  return request.get<Api.Common.TreeItem[]>({
    url: '/api/student/info/class/tree'
  })
}
// 获取班级列表
export function fetchGetStudentPage(params: Api.ResourcesManage.StudentSearchParams) {
  return request.get<Api.ResourcesManage.StudentPage>({
    url: '/api/student/info/query',
    params
  })
}
// 获取班级列表
export function fetchGetStudentList() {
  return request.get<Api.Common.OptionItem[]>({
    url: '/api/student/info/list'
  })
}
// 获取班级信息
export function fetchGetStudent(id: string) {
  return request.get<Api.ResourcesManage.StudentItem>({
    url: '/api/student/info/get',
    params: { id }
  })
}
// 保存班级信息
export function fetchSaveStudent(params: Api.ResourcesManage.StudentItem) {
  return request.post<Api.ResourcesManage.StudentItem>({
    url: '/api/student/info/save',
    params
  })
}
export function fetchDeleteStudent(params: string[]) {
  return request.post({
    url: '/api/student/info/delete',
    params
  })
}

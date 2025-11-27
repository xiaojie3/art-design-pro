import request from '@/utils/http'

export function fetchSaveMenu(params: Api.SystemManage.MenuFormData) {
  return request.post<Api.SystemManage.MenuFormData>({
    url: '/api/system/menu',
    params,
    showErrorMessage: true,
    showSuccessMessage: true
  })
}

export function fetchDeleteMenu(id: string) {
  return request.del({
    url: `/api/system/menu/${id}`
  })
}

import request from '@/utils/http'

export function fetchGetDictPage(params: Api.SystemManage.DictSearchParams) {
  return request.get<Api.SystemManage.DictList>({
    url: '/api/system/dict/query',
    params
  })
}

export function fetchSaveDict(data: Api.SystemManage.DictItem) {
  return request.post<Api.SystemManage.DictItem>({
    url: '/api/system/dict',
    data
  })
}

export function fetchUpdateDict(params: Api.SystemManage.DictItem) {
  return request.put<Api.SystemManage.DictItem>({
    url: '/api/system/dict',
    params
  })
}

export function fetchDeleteDictItem(id: string) {
  return request.del({
    url: '/api/system/dict/' + id
  })
}

export function fetchGetDictTypePage() {
  return request.get<Api.SystemManage.DictTypeList>({
    url: '/api/system/dict-type/query'
  })
}

export function fetchSaveDictType(params: Api.SystemManage.DictTypeItem) {
  return request.post<Api.SystemManage.DictTypeItem>({
    url: '/api/system/dict-type',
    params
  })
}

export function fetchUpdateDictType(params: Api.SystemManage.DictTypeItem) {
  return request.put<Api.SystemManage.DictTypeItem>({
    url: '/api/system/dict-type',
    params
  })
}

export function fetchDeleteDictType(type: string) {
  return request.del<void>({
    url: '/api/system/dict-type/' + type
  })
}

export function fetchGetDictTypeList() {
  return request.get<Api.SystemManage.DictTypeItem[]>({
    url: '/api/system/dict-type'
  })
}

import request from '@/utils/http'

export function fetchGetDictListByType(type: string) {
  return request.get<Api.SystemManage.DictItem[]>({
    url: '/api/system/dicts/' + type
  })
}

export function fetchGetDictTypes() {
  return request.get<Api.SystemManage.DictTypeItem[]>({
    url: '/api/system/dict-type'
  })
}

export function fetchSaveDictType(data: Api.SystemManage.DictTypeItem) {
  return request.post<Api.SystemManage.DictTypeItem>({
    url: '/api/system/dict-type',
    data
  })
}

export function fetchDeleteDictType(type: string) {
  return request.del<void>({
    url: '/api/system/dict-type/' + type
  })
}

export function fetchSaveDictItem(data: Api.SystemManage.DictItem) {
  return request.post<Api.SystemManage.DictItem>({
    url: '/api/system/dicts',
    data
  })
}

export function fetchDeleteDictItem(id: string) {
  return request.del({
    url: '/api/system/dicts/' + id
  })
}

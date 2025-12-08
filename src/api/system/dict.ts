import request from '@/utils/http'

export function fetchGetDictDataPage(params: Api.SystemManage.DictDataSearchParams) {
  return request.get<Api.SystemManage.DictList>({
    url: '/api/system/dict/query',
    params
  })
}

export function fetchGetDictData(params: string[]) {
  return request.post<Api.SystemManage.DictMap>({
    url: '/api/system/dict/list',
    params
  })
}

export function fetchSaveDictData(params: Api.SystemManage.DictDataItem) {
  return request.post<Api.SystemManage.DictDataItem>({
    url: '/api/system/dict',
    params
  })
}

export function fetchUpdateDictData(params: Api.SystemManage.DictDataItem) {
  return request.put<Api.SystemManage.DictDataItem>({
    url: '/api/system/dict',
    params
  })
}

export function fetchDeleteDictData(id: string) {
  return request.del({
    url: '/api/system/dict',
    params: { id }
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

export function fetchDeleteDictType(id: string) {
  return request.del<void>({
    url: '/api/system/dict-type',
    params: { id }
  })
}

export function fetchGetDictTypeList() {
  return request.get<Api.SystemManage.DictTypeItem[]>({
    url: '/api/system/dict-type'
  })
}

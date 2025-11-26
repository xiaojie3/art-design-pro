import request from '@/utils/http'

export function fetchGetDict(type: string) {
  return request.get<Api.SystemManage.DictListItem[]>({
    url: '/api/system/dicts/' + type
  })
}

export function fetchGetDictTypes() {
  return request.get<string[]>({
    url: '/api/system/dicts/types'
  })
}

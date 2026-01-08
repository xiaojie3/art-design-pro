import request from '@/utils/http'
// 获取漫画列表
export function fetchGetComicPage(params: Api.Ai.ComicSearchParams) {
  return request.get<Api.Ai.ComicPage>({
    url: '/api/ai/comic/info/query',
    params
  })
}
// 获取漫画列表
export function fetchGetComicList() {
  return request.get<Api.Ai.ComicItem[]>({
    url: '/api/ai/comic/info/list'
  })
}
// 获取漫画信息
export function fetchGetComic(id: string) {
  return request.get<Api.Ai.ComicItem>({
    url: '/api/ai/comic/info/get',
    params: { id }
  })
}
// 保存漫画信息
export function fetchSaveComic(params: Api.Ai.ComicItem) {
  return request.post<Api.Ai.ComicItem>({
    url: '/api/ai/comic/info/save',
    params
  })
}
// 删除漫画
export function fetchDeleteComic(params: string[]) {
  return request.post({
    url: '/api/ai/comic/info/delete',
    params
  })
}
export function fetchGetComicCollectionList() {
  return request.get<Api.Common.OptionItem[]>({
    url: '/api/ai/comic/collection/list'
  })
}

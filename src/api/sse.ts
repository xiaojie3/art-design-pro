import request from '@/utils/http'
// 获取漫画列表
export function fetchSseSendMessage() {
  return request.get<string>({
    url: '/sse/send'
  })
}

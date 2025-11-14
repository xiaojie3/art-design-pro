import request from '@/utils/http'

/**
 * 登录
 * @param params 登录参数
 * @returns 登录响应
 */
export function fetchLogin(params: Api.Auth.LoginParams) {
  return request.post<Api.Auth.LoginResponse>({
    url: '/api/auth/login',
    params
    // showSuccessMessage: true // 显示成功消息
    // showErrorMessage: false // 不显示错误消息
  })
}
/**
 * 退出登录
 * @returns 退出登录响应
 */
export function fetchLogout() {
  return request.post<void>({
    url: '/api/auth/logout'
  })
}
/**
 * 刷新令牌
 * @param refreshToken 刷新令牌
 * @returns 刷新令牌响应
 */
export function fetchRefreshToken(refreshToken: string) {
  return request.post<Api.Auth.LoginResponse>({
    url: '/api/auth/refresh-token',
    params: {
      refreshToken
    }
  })
}

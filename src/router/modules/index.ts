import { AppRouteRecord } from '@/types/router'
import { systemRoutes } from './system'
import { devToolsRoutes } from './devTools'

/**
 * 导出所有模块化路由
 */
export const routeModules: AppRouteRecord[] = [systemRoutes, devToolsRoutes]

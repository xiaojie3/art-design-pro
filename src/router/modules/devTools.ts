import { AppRouteRecord } from '@/types/router'

export const devToolsRoutes: AppRouteRecord = {
  path: '/dev-tools',
  name: 'DevTools',
  component: '/index/index',
  meta: {
    title: 'devTools.title',
    icon: 'ri:wrench-line'
  },
  children: [
    {
      path: 'widgets',
      name: 'Widgets',
      component: '',
      meta: {
        title: 'devTools.widgets.title',
        icon: 'ri:apps-2-add-line'
      },
      children: [
        {
          path: 'icon',
          name: 'Icon',
          component: '/dev-tools/widgets/icon',
          meta: {
            title: 'devTools.widgets.icon',
            icon: 'ri:palette-line'
          }
        }
      ]
    },
    {
      path: 'examples',
      name: 'Examples',
      component: '',
      meta: {
        title: 'devTools.examples.title',
        icon: 'ri:sparkling-line'
      },
      children: [
        {
          path: 'forms',
          name: 'Forms',
          component: '/dev-tools/examples/forms',
          meta: {
            title: 'devTools.examples.forms',
            icon: 'ri:table-view',
            keepAlive: true
          }
        }
      ]
    },
    {
      path: 'exception',
      name: 'Exception',
      component: '',
      meta: {
        title: 'menus.exception.title',
        icon: 'ri:error-warning-line'
      },
      children: [
        {
          path: '403',
          name: 'Exception403',
          component: '/exception/403',
          meta: {
            title: 'menus.exception.forbidden',
            icon: 'ri:prohibited-line',
            keepAlive: true,
            isHideTab: true,
            isFullPage: true
          }
        },
        {
          path: '404',
          name: 'Exception404',
          component: '/exception/404',
          meta: {
            title: 'menus.exception.notFound',
            icon: 'ri:question-line',
            keepAlive: true,
            isHideTab: true,
            isFullPage: true
          }
        },
        {
          path: '500',
          name: 'Exception500',
          component: '/exception/500',
          meta: {
            title: 'menus.exception.serverError',
            icon: 'ri:close-circle-line',
            keepAlive: true,
            isHideTab: true,
            isFullPage: true
          }
        }
      ]
    },
    {
      path: 'result',
      name: 'Result',
      component: '',
      meta: {
        title: 'menus.result.title',
        icon: 'ri:checkbox-circle-line'
      },
      children: [
        {
          path: 'success',
          name: 'ResultSuccess',
          component: '/result/success',
          meta: {
            title: 'menus.result.success',
            icon: 'ri:checkbox-circle-line',
            keepAlive: true
          }
        },
        {
          path: 'fail',
          name: 'ResultFail',
          component: '/result/fail',
          meta: {
            title: 'menus.result.fail',
            icon: 'ri:close-circle-line',
            keepAlive: true
          }
        }
      ]
    }
  ]
}

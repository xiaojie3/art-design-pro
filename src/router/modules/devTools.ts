import { AppRouteRecord } from '@/types/router'

export const devToolsRoutes: AppRouteRecord = {
  path: '/dev-tools',
  name: 'DevTools',
  component: '/index/index',
  meta: {
    title: 'devTools.title',
    icon: '&#xe816;',
    roles: ['R_SUPER']
  },
  children: [
    {
      path: '/widgets',
      name: 'Widgets',
      component: '',
      meta: {
        title: 'devTools.widgets.title'
      },
      children: [
        {
          path: 'icon-list',
          name: 'IconList',
          component: '/dev-tools/widgets/icon-list',
          meta: {
            title: 'devTools.widgets.iconList'
          }
        }
      ]
    },
    {
      path: 'examples',
      name: 'Examples',
      component: '',
      meta: {
        title: 'devTools.examples.title'
      },
      children: [
        {
          path: 'forms',
          name: 'Forms',
          component: '/dev-tools/examples/forms',
          meta: {
            title: 'devTools.examples.forms',
            keepAlive: true
          }
        }
      ]
    }
  ]
}

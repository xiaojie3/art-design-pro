import { AppRouteRecord } from '@/types/router'

export const devToolsRoutes: AppRouteRecord = {
  path: '/dev-tools',
  name: 'DevTools',
  component: '/index/index',
  meta: {
    title: 'menus.devTools.title',
    icon: '&#xe816;',
    roles: ['R_SUPER']
  },
  children: [
    {
      path: '/widgets',
      name: 'Widgets',
      component: '',
      meta: {
        title: 'menus.devTools.widgets.title'
      },
      children: [
        {
          path: 'icon-list',
          name: 'IconList',
          component: '/dev-tools/widgets/icon-list',
          meta: {
            title: 'menus.devTools.widgets.iconList'
          }
        }
      ]
    },
    {
      path: 'examples',
      name: 'Examples',
      component: '',
      meta: {
        title: 'menus.devTools.examples.title'
      },
      children: [
        {
          path: 'forms',
          name: 'Forms',
          component: '/dev-tools/examples/forms',
          meta: {
            title: 'menus.devTools.examples.forms',
            keepAlive: true
          }
        }
      ]
    }
  ]
}

import { AppRouteRecord } from '@/types/router'

export const resourcesRoutes: AppRouteRecord = {
  path: '/resources',
  name: 'Resources',
  component: '/index/index',
  meta: {
    title: 'menus.resources.title',
    icon: '&#xe7b9;',
    roles: ['R_SUPER', 'R_ADMIN']
  },
  children: [
    {
      path: 'school',
      name: 'School',
      component: '/resources/school',
      meta: {
        title: 'menus.resources.school'
      }
    },
    {
      path: 'campus',
      name: 'Campus',
      component: '/resources/campus',
      meta: {
        title: 'menus.resources.campus'
      }
    },
    {
      path: 'college',
      name: 'College',
      component: '/resources/college',
      meta: {
        title: 'menus.resources.college'
      }
    },
    {
      path: 'department',
      name: 'Department',
      component: '/resources/department',
      meta: {
        title: 'menus.resources.department'
      }
    },
    {
      path: 'major',
      name: 'Major',
      component: '/resources/major',
      meta: {
        title: 'menus.resources.major'
      }
    },
    {
      path: 'class',
      name: 'Class',
      component: '/resources/class',
      meta: {
        title: 'menus.resources.class'
      }
    }
  ]
}

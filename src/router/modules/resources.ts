import { AppRouteRecord } from '@/types/router'

export const resourcesRoutes: AppRouteRecord = {
  path: '/resources',
  name: 'Resources',
  component: '/index/index',
  meta: {
    title: 'resources.title',
    icon: '&#xe8af;',
    roles: ['R_SUPER', 'R_ADMIN']
  },
  children: [
    {
      path: 'school',
      name: 'School',
      component: '/resources/school',
      meta: {
        title: 'resources.school.title'
      }
    },
    {
      path: 'campus',
      name: 'Campus',
      component: '/resources/campus',
      meta: {
        title: 'resources.campus.title'
      }
    },
    {
      path: 'college',
      name: 'College',
      component: '/resources/college',
      meta: {
        title: 'resources.college.title'
      }
    },
    {
      path: 'department',
      name: 'Department',
      component: '/resources/department',
      meta: {
        title: 'resources.department.title'
      }
    },
    {
      path: 'major',
      name: 'Major',
      component: '/resources/major',
      meta: {
        title: 'resources.major.title'
      }
    },
    {
      path: 'class',
      name: 'Class',
      component: '/resources/class',
      meta: {
        title: 'resources.class.title'
      }
    }
  ]
}

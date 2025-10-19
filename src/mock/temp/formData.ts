export interface User {
  id: number
  username: string
  gender: 1 | 0
  mobile: string
  email: string
  dep: string
  status: string
  create_time: string
  avatar: string
}

export interface Role {
  roleName: string
  roleCode: string
  des: string
  date: string
  enable: boolean
}

// 角色列表
export const ROLE_LIST_DATA: Role[] = [
  {
    roleName: '超级管理员',
    roleCode: 'R_SUPER',
    des: '拥有系统全部权限',
    date: '2025-05-15 12:30:45',
    enable: true
  },
  {
    roleName: '管理员',
    roleCode: 'R_ADMIN',
    des: '拥有系统管理权限',
    date: '2025-05-15 12:30:45',
    enable: true
  },
  {
    roleName: '普通用户',
    roleCode: 'R_USER',
    des: '拥有系统普通权限',
    date: '2025-05-15 12:30:45',
    enable: true
  },
  {
    roleName: '财务管理员',
    roleCode: 'R_FINANCE',
    des: '管理财务相关权限',
    date: '2025-05-16 09:15:30',
    enable: true
  },
  {
    roleName: '数据分析师',
    roleCode: 'R_ANALYST',
    des: '拥有数据分析权限',
    date: '2025-05-16 11:45:00',
    enable: false
  },
  {
    roleName: '客服专员',
    roleCode: 'R_SUPPORT',
    des: '处理客户支持请求',
    date: '2025-05-17 14:30:22',
    enable: true
  },
  {
    roleName: '营销经理',
    roleCode: 'R_MARKETING',
    des: '管理营销活动权限',
    date: '2025-05-17 15:10:50',
    enable: true
  },
  {
    roleName: '访客用户',
    roleCode: 'R_GUEST',
    des: '仅限浏览权限',
    date: '2025-05-18 08:25:40',
    enable: false
  },
  {
    roleName: '系统维护员',
    roleCode: 'R_MAINTAINER',
    des: '负责系统维护和更新',
    date: '2025-05-18 09:50:12',
    enable: true
  },
  {
    roleName: '项目经理',
    roleCode: 'R_PM',
    des: '管理项目相关权限',
    date: '2025-05-19 13:40:35',
    enable: true
  }
]

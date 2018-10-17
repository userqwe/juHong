import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    name: 'home',
    children: [{
      path: 'home',
      component: () => import('@/views/home/index'),
      meta: { title: '系统首页', icon: 'home' }
    }]
  },
  {
    path: '/device',
    component: Layout,
    meta: { title: '设备管理', icon: 'device' },
    children: [
      {
        path: 'index',
        name: 'dev_index',
        component: () => import('@/views/device/index'),
        meta: { title: '设备管理', icon: 'device' }
      },
      {
        path: 'add',
        name: 'dev_add',
        component: () => import('@/views/device/add'),
        meta: { title: '添加设备', icon: 'add' },
        hidden: true
      },
      {
        path: 'exa_dev',
        name: 'dev_exa_dev',
        component: () => import('@/views/device/exa_dev'),
        meta: { title: '查看设备', icon: 'form' },
        hidden: true
      }
    ]
  },
  {
    path: '/ad_mag',
    component: Layout,
    meta: { title: '内容分发', icon: 'ad' },
    children: [
      {
        path: 'index',
        name: 'ad_mag_index',
        component: () => import('@/views/ad_mag/index'),
        meta: { title: '内容管理', icon: 'ad_mag_index' }
      },
      {
        path: 'ad_list',
        name: 'ad_mag_list',
        component: () => import('@/views/ad_mag/ad_list'),
        meta: { title: '节目单', icon: 'ad_mag_index' },
        hidden: false
      },
      {
        path: 'ad_verify',
        name: 'ad_mag_ad_verify',
        component: () => import('@/views/ad_mag/ad_verify'),
        meta: { title: '内容审核', icon: 'verify' },
        hidden: true
      },
      {
        path: 'plan_detail',
        name: 'ad_mag_plan_detail',
        component: () => import('@/views/ad_mag/plan_detail'),
        meta: { title: '内容详情', icon: 'form' },
        hidden: true
      },
      {
        path: 'ad_pub',
        name: 'ad_mag_ad_pub',
        component: () => import('@/views/ad_mag/ad_pub'),
        meta: { title: '内容发布', icon: 'add' }
      },
      {
        path: 'ad_detail',
        name: 'ad_mag_ad_detail',
        component: () => import('@/views/ad_mag/ad_detail'),
        meta: { title: '广告详情', icon: 'detail' },
        hidden: true
      }
    ]
  },
  {
    path: '/material_mag',
    component: Layout,
    meta: { title: '素材管理', icon: 'material' },
    children: [
      {
        path: 'index',
        name: 'material_index',
        component: () => import('@/views/material/index'),
        meta: { title: '素材管理', icon: 'material' }
      },
      {
        path: 'add_material',
        name: 'material_add',
        component: () => import('@/views/material/add'),
        meta: { title: '新增素材', icon: 'add' }
      },
      {
        path: 'dustbin',
        name: 'material_dustbin',
        component: () => import('@/views/material/dustbin'),
        meta: { title: '回收站', icon: 'dustbin' }
      }
    ]
  },
  {
    path: '/devgroup_mag',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'devgroup_index',
        component: () => import('@/views/dev_group/index'),
        meta: { title: '设备组管理', icon: 'dev_group' }
      }
    ]
  },
  {
    path: '/layout_mag',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'devgroup_index',
        component: () => import('@/views/form/index'),
        meta: { title: '布局管理', icon: 'layout' }
      }
    ],
    hidden: true
  },

  {
    path: '/user_mag',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'user_mag/index',
        component: () => import('@/views/form/index'),
        meta: { title: '用户管理', icon: 'user_manage' }
      }
    ],
    hidden: true
  },
  {
    path: '/operation_log',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'operate_log_index',
        component: () => import('@/views/operate_log/index'),
        meta: { title: '操作日志', icon: 'log' }
      }
    ],
    hidden: false
  },

  {
    path: '/personal_center',
    component: Layout,
    meta: { title: '个人中心', icon: 'personal' },
    children: [
      {
        path: 'modify_pwd',
        name: 'p_modify_pwd',
        component: () => import('@/views/personal_center/modify_pwd'),
        meta: { title: '修改密码', icon: 'password' }
      },
      {
        path: 'user_mag',
        name: 'p_user_mag',
        component: () => import('@/views/personal_center/user_mag'),
        meta: { title: '用户管理', icon: 'userlist' }
      },
      {
        path: 'permission',
        name: 'p_permission',
        component: () => import('@/views/personal_center/permission'),
        meta: { title: '权限管理', icon: 'permission' }
      },
      {
        path: 'add_role',
        name: 'p_add_role',
        component: () => import('@/views/personal_center/add_role'),
        meta: { title: '新增角色', icon: 'permission' },
        hidden: true
      }
    ],
    hidden: false
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})


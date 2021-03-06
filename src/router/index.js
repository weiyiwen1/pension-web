import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '??????', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/platformManager',
    component: Layout,
    name: '????????????',
    meta: {
      title: '????????????',
      icon: 'excel'
    },
    children: [
      {
        path: 'consultation',
        component: () => import('@/views/reception-manager/consultation/consultation.vue'),
        name: 'Consultation',
        meta: { title: '????????????', icon: 'list' }
      },
      {
        path: 'leaderReception',
        component: () => import('@/views/reception-manager/leader-reception/reception.vue'),
        name: 'LeaderReception',
        meta: { title: '????????????', icon: 'user' }
      },
      {
        path: 'volunteerReception',
        component: () => import('@/views/reception-manager/volunteer-reception/reception.vue'),
        name: 'VolunteerReception',
        meta: { title: '????????????', icon: 'user' }
      }
    ]
  },
  {
    path: '/donationManager',
    component: Layout,
    name: '????????????',
    meta: {
      title: '????????????',
      icon: 'excel'
    },
    children: [
      {
        path: 'servicePersonal',
        component: () => import('@/views/donate-manager/service-personal/service-personal.vue'),
        name: 'ServicePersonal',
        meta: { title: '????????????', icon: 'list' }
      },
      {
        path: 'serviceUnit',
        component: () => import('@/views/donate-manager/service-unit/service-unit.vue'),
        name: 'ServiceUnit',
        meta: { title: '????????????', icon: 'user' }
      },
      {
        path: 'volunteerReception',
        component: () => import('@/views/donate-manager/donation/donation.vue'),
        name: 'VolunteerReception',
        meta: { title: '????????????', icon: 'user' }
      }
    ]
  },
  {
    path: '/personManager',
    component: Layout,
    name: '????????????',
    meta: {
      title: '????????????',
      icon: 'excel'
    },
    children: [
      {
        path: 'person',
        component: () => import('@/views/person/person.vue'),
        name: 'Person',
        meta: { title: '????????????', icon: 'list' }
      }
    ]
  },
  {
    path: '/healthManager',
    component: Layout,
    name: '????????????',
    meta: {
      title: '????????????',
      icon: 'excel'
    },
    children: [
      {
        path: 'healthArchive',
        component: () => import('@/views/health-manager/archive/person.vue'),
        name: 'HealthArchive',
        meta: { title: '????????????', icon: 'list' }
      },
      {
        path: 'healthData',
        component: () => import('@/views/health-manager/health-data/health-data.vue'),
        name: 'HealthData',
        meta: { title: '????????????', icon: 'list' }
      }
    ]
  },
  {
    path: '/checkinManager',
    component: Layout,
    name: '????????????',
    meta: {
      title: '????????????',
      icon: 'excel'
    },
    children: [
      {
        path: 'booking',
        component: () => import('@/views/checkin-manager/booking/index.vue'),
        name: 'Booking',
        meta: { title: '????????????', icon: 'list' }
      },
      {
        path: 'checkin-list',
        component: () => import('@/views/checkin-manager/checkin-record/checkin-list.vue'),
        name: 'CheckinList',
        meta: { title: '????????????', icon: 'list' }
      },
      {
        path: 'bedList',
        component: () => import('@/views/checkin-manager/bed-manager/bed-list.vue'),
        name: 'BedList',
        meta: { title: '????????????', icon: 'list' }
      },
      {
        path: 'leaveManager',
        component: () => import('@/views/checkin-manager/leave-manager/leave.vue'),
        name: 'LeaveManager',
        meta: { title: '????????????', icon: 'list' }
      },
      {
        path: 'checkoutManager',
        component: () => import('@/views/checkin-manager/checkout-manager/checkout.vue'),
        name: 'CheckoutManager',
        meta: { title: '????????????', icon: 'list' }
      },
      {
        path: 'changeBedManager',
        component: () => import('@/views/checkin-manager/change-bed/change-bed.vue'),
        name: 'ChangeBedManager',
        meta: { title: '????????????', icon: 'list' }
      },
      {
        path: 'chargeSetting',
        component: () => import('@/views/checkin-manager/charge-setting/charge-setting.vue'),
        name: 'ChargeSetting',
        meta: { title: '????????????', icon: 'list' }
      }
    ]
  },
  {
    path: '/safetyManager',
    component: Layout,
    name: '????????????',
    meta: {
      title: '????????????',
      icon: 'excel'
    },
    children: [
      {
        path: 'dwxxManager',
        component: () => import('@/views/safety/dwjks.vue'),
        name: 'DwxxManager',
        meta: { title: '????????????', icon: 'list' }
      },
      {
        path: 'dwjkManager',
        component: () => import('@/views/safety/dwjk.vue'),
        name: 'DwjkManager',
        meta: { title: '????????????', icon: 'list' }
      },
      {
        path: 'mjglManager',
        component: () => import('@/views/safety/mjgl.vue'),
        name: 'mjglManager',
        meta: { title: '????????????', icon: 'list' }
      }
    ]
  },
  {
    path: '/financeManager',
    component: Layout,
    name: '????????????',
    meta: {
      title: '????????????',
      icon: 'excel'
    },
    children: [
      {
        path: 'accountRecord',
        component: () => import('@/views/finance-manager/account/account-record.vue'),
        name: 'AccountRecord',
        meta: { title: '????????????', icon: 'list' }
      },
      {
        path: 'refundManager',
        component: () => import('@/views/finance-manager/refund/refund-manager.vue'),
        name: 'RefundManager',
        meta: { title: '????????????', icon: 'user' }
      },
      {
        path: 'billSettle',
        component: () => import('@/views/finance-manager/settle/bill-settle.vue'),
        name: 'BillSettle',
        meta: { title: '????????????', icon: 'user' }
      },
      {
        path: 'checkoutSettle',
        component: () => import('@/views/finance-manager/checkout-settle/checkout-settle.vue'),
        name: 'CheckoutSettle',
        meta: { title: '????????????', icon: 'user' }
      },
      {
        path: 'settleRecord',
        component: () => import('@/views/finance-manager/settle-record/settle-record.vue'),
        name: 'SettleRecord',
        meta: { title: '????????????', icon: 'user' }
      },
      {
        path: 'billDetail',
        component: () => import('@/views/finance-manager/bill-detail/bill-detail.vue'),
        name: 'BillDetail',
        meta: { title: '????????????', icon: 'user' }
      }
    ]
  },
  {
    path: '/platformManager4',
    component: Layout,
    name: '????????????',
    meta: {
      title: '????????????',
      icon: 'excel'
    },
    children: [
      {
        path: 'arrearage',
        component: () => import('@/views/arrearage/index.vue'),
        name: 'Arrearage',
        meta: { title: '????????????', icon: 'list' }
      },
      {
        path: 'birthdayList',
        component: () => import('@/views/remind-manager/birthday/birthday-list.vue'),
        name: 'BirthdayList',
        meta: { title: '????????????', icon: 'user' }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'Permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'Page Permission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'Directive Permission'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: 'Role Permission',
          roles: ['admin']
        }
      }
    ]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

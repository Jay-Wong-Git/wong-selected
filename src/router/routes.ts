//常量路由
export const constRoutes = [
  {
    //登录
    name: 'login', //命名路由
    path: '/login',
    meta: {
      title: 'Login', //用于菜单标题展示
      hidden: true, //是否在菜单标题展示时隐藏
      icon: 'Promotion', //菜单左侧图标
    },
    component: () => import('@/views/login/index.vue'),
  },
  {
    //登录成功
    name: 'layout',
    path: '/',
    meta: {
      title: 'Layout',
      hidden: false,
      icon: 'Grid',
    },
    component: () => import('@/layout/index.vue'),
    redirect: '/home',
    children: [
      {
        name: 'home',
        path: '/home',
        meta: {
          title: 'Home',
          hidden: false,
          icon: 'House',
        },
        component: () => import('@/views/home/index.vue'),
      },
    ],
  },
  {
    name: 'screen',
    path: '/screen',
    meta: {
      title: 'Screen',
      hidden: false,
      icon: 'Monitor',
    },
    component: () => import('@/views/screen/index.vue'),
  },
  {
    //访问路径错误
    name: '404',
    path: '/404',
    meta: {
      title: '404',
      hidden: true,
      icon: 'Close',
    },
    component: () => import('@/views/404/index.vue'),
  },
]
//异步路由
export const asyncRoutes = [
  {
    name: 'Acl',
    path: '/acl',
    meta: {
      title: 'Access Control',
      hidden: false,
      icon: 'Lock',
    },
    component: () => import('@/layout/index.vue'),
    redirect: '/acl/user',
    children: [
      {
        name: 'User',
        path: '/acl/user',
        meta: {
          title: 'User Management',
          hidden: false,
          icon: 'Avatar',
        },
        component: () => import('@/views/acl/user/index.vue'),
      },
      {
        name: 'Role',
        path: '/acl/role',
        meta: {
          title: 'Role Management',
          hidden: false,
          icon: 'HelpFilled',
        },
        component: () => import('@/views/acl/role/index.vue'),
      },
      {
        name: 'Permission',
        path: '/acl/permission',
        meta: {
          title: 'Permission Management',
          hidden: false,
          icon: 'DocumentChecked',
        },
        component: () => import('@/views/acl/permission/index.vue'),
      },
    ],
  },
  {
    name: 'Product',
    path: '/product',
    meta: {
      title: 'Product Management',
      hidden: false,
      icon: 'Goods',
    },
    component: () => import('@/layout/index.vue'),
    redirect: '/product/trademark',
    children: [
      {
        name: 'Trademark',
        path: '/product/trademark',
        meta: {
          title: 'Trademark Management',
          hidden: false,
          icon: 'Ticket',
        },
        component: () => import('@/views/product/trademark/index.vue'),
      },
      {
        name: 'Attr',
        path: '/product/attr',
        meta: {
          title: 'Attr Management',
          hidden: false,
          icon: 'Connection',
        },
        component: () => import('@/views/product/attr/index.vue'),
      },
      {
        name: 'Spu',
        path: '/product/spu',
        meta: {
          title: 'SPU Management',
          hidden: false,
          icon: 'Files',
        },
        component: () => import('@/views/product/spu/index.vue'),
      },
      {
        name: 'Sku',
        path: '/product/sku',
        meta: {
          title: 'SKU Management',
          hidden: false,
          icon: 'Edit',
        },
        component: () => import('@/views/product/sku/index.vue'),
      },
    ],
  },
]
//任意路由
export const anyRoute = {
  //任意非法路由重定向至404
  name: 'any',
  path: '/:pathMatch(.*)*',
  meta: {
    title: 'Any',
    hidden: true,
    icon: 'Cherry',
  },
  redirect: '/404',
}

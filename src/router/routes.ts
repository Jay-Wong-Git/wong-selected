//对外暴露配置路由（常量路由）
export const constRoutes = [
  {
    //登录
    name: 'login', //命名路由
    path: '/login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    //登录成功
    name: 'layout',
    path: '/',
    component: () => import('@/layout/index.vue'),
  },
  {
    //访问路径错误
    name: '404',
    path: '/404',
    component: () => import('@/views/404/index.vue'),
  },
  {
    //任意非法路由重定向至404
    name: 'any',
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]

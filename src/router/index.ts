//通过vue-router插件实现模版路由配置
import { createRouter, createWebHashHistory } from 'vue-router'
import { constRoutes } from '@/router/routes'
//创建路由器
const router = createRouter({
  //配置路由模式为hash
  history: createWebHashHistory(),
  routes: constRoutes,
  //滚动行为，切换路由时让滚动条处于顶部
  scrollBehavior() {
    return { left: 0, top: 0 }
  },
})

export default router

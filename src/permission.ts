//路由鉴权
import router from '@/router'
//引入进度条插件及css文件
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
//引入大仓库pinia
import pinia from '@/store'
//引入用户相关数据的仓库
import useUserStore from '@/store/modules/user'
import { ElMessage } from 'element-plus'
//引入项目配置文件
import settings from './settings'

//获取用户相关数据仓库
const userStore = useUserStore(pinia)

//进度条不显示小圆圈
nprogress.configure({ showSpinner: false })

//配置全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  /*  to表示要访问的路由对象
    from表示来自哪个路由对象
    next表示放行函数
    */
  //实现切换路由时展示进度条
  nprogress.start()
  //获取token用来判断用户是否已经登录
  let token = userStore.token
  let username = userStore.username
  if (token) {
    //已登录且访问/login时，阻止其访问/login
    if (to.path === '/login') {
      next({ to: from.path })
    } else {
      //已登录且不访问/login
      //若已有用户信息，直接放行
      if (username) {
        next()
      } else {
        //没有用户信息，需要先发送请求获取用户信息，成功后再放行
        try {
          await userStore.userInfo()
          next()
        } catch (e) {
          //token过期或者用户手动修改了本地存储的token
          //退出登录
          await userStore.userLogout()
          //返回登录页
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    //未登录且访问/login，直接放行
    if (to.path === '/login') {
      next()
    } else {
      //未登录且访问其他路由
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

//配置全局后置守卫
router.afterEach((to: any, from: any, next: any) => {
  //切换网页标题
  document.title = settings.titleAbbr + ' - ' + to.meta.title
  nprogress.done()
})

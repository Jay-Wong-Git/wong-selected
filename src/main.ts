import { createApp } from 'vue'
import App from '@/App.vue'
//引入模板的全局的样式
import '@/styles/index.scss'
//引入element-plus插件与样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//配置element-plus国际化
//@ts-expect-error
import en from 'element-plus/dist/locale/en.mjs'
//svg插件需要配置代码
import 'virtual:svg-icons-register'
//引入自定义插件对象:注册整个项目全局组件
import globalComponent from '@/components'
//引入路由
import router from '@/router'
//引入pinia
import pinia from '@/store'
//引入路由鉴权文件
import './permission'
//获取应用实例对象
const app = createApp(App)
//安装自定义插件
app.use(globalComponent)
//安装element-plus插件
app.use(ElementPlus, {
  locale: en, //element-plus国际化配置
})
//注册模版路由
app.use(router)
//安装仓库
app.use(pinia)
//挂载应用
app.mount('#app')

//引入项目中全部的全局组件
import SvgIcon from '@/components/SvgIcon/index.vue'
import Pagination from '@/components/Pagination/index.vue'
//引入element-plus提供全部图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//全局对象
const allGlobalComponents: any = { SvgIcon, Pagination }
//对外暴露插件对象
export default {
  install(app: any) {
    //注册项目的所有全局组件
    Object.keys(allGlobalComponents).forEach((key) => {
      //注册为全局组件
      app.component(key, allGlobalComponents[key])
    })
    //将element-plus提供的图标注册为全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}

//layout组件相关配置仓库
import { defineStore } from 'pinia'
export default defineStore('LayoutSettingStore', {
  state() {
    return {
      isFolded: false, //表示菜单是否折叠
      refresh: false, //用来控制刷新数据
    }
  },
  actions: {},
})

<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" v-if="flag" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
//引入layout设置相关小仓库
import useLayoutSettingStore from '@/store/modules/setting'
import { nextTick, ref, watch } from 'vue'
const layoutSettingStore = useLayoutSettingStore()
//控制组件是否需要销毁: false表示销毁；true表示不销毁
let flag = ref(true)
//监听是否点击刷新按钮
watch(
  () => layoutSettingStore.refresh,
  () => {
    flag.value = false
    nextTick(() => {
      flag.value = true
    })
  },
)
</script>
<script lang="ts">
export default {
  name: 'Main',
}
</script>
<style lang="scss" scoped>
.fade-enter-from {
  opacity: 0;
  //transform: scale(0);
}
.fade-enter-to {
  opacity: 1;
  //transform: scale(1);
}
.fade-enter-active {
  transition: all 0.3s;
}
</style>

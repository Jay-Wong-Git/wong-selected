<template>
  <el-icon style="margin-right: 10px" @click="changeIcon">
    <component :is="layoutSettingStore.isFolded ? 'Expand' : 'Fold'" />
  </el-icon>
  <!-- 面包屑动态展示路由名字与标题 -->
  <el-breadcrumb separator-icon="ArrowRight" style="margin-left: 10px">
    <el-breadcrumb-item
      v-for="item in $route.matched"
      :key="item.path"
      :to="item.path"
      v-show="item.path !== '/'"
    >
      <el-icon style="translate: 0 1px">
        <component :is="item.meta.icon" />
      </el-icon>
      <span style="margin-left: 5px">{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
//layout配置相关仓库
import useLayoutSettingStore from '@/store/modules/setting'
import { useRoute } from 'vue-router'
import { handleError } from 'vue'
const layoutSettingStore = useLayoutSettingStore()
const changeIcon = () => {
  layoutSettingStore.isFolded = !layoutSettingStore.isFolded
}
//获取路由对象
const $route = useRoute()
</script>
<script lang="ts">
export default {
  name: 'Breadcrumb',
}
</script>
<style lang="scss" scoped></style>

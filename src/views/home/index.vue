<template>
  <h1>Hello, {{ userStore.username }}</h1>
</template>

<script setup lang="ts">
//引入用户数据相关的仓库
import useUserStore from '@/store/modules/user'
import { onMounted } from 'vue'

const userStore = useUserStore()
//组件一挂载就请求用户数据
onMounted(() => {
  userStore.userInfo()
})
</script>

<style lang="scss" scoped></style>

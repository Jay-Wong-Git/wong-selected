<template>
  <h1>Hello, {{ userStore.username }}</h1>
</template>

<script setup lang="ts">
//引入用户数据相关的仓库
import useUserStore from '@/store/modules/user'
import { onMounted } from 'vue'
import { ElNotification } from 'element-plus'

const userStore = useUserStore()
//组件一挂载就请求用户数据
onMounted(() => {
  try {
    userStore.userInfo()
  } catch (e) {
    //获取用户信息失败弹出错误提示
    ElNotification({
      type: 'error',
      title: 'Load user info failed!',
      message: (e as Error).message,
    })
  }
})
</script>

<style lang="scss" scoped></style>

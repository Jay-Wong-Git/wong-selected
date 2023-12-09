<template>
  <el-button
    size="small"
    icon="Refresh"
    circle
    @click="handleRefresh"
  ></el-button>
  <el-button
    size="small"
    icon="FullScreen"
    circle
    @click="handleFullScreen"
  ></el-button>
  <el-button size="small" icon="Setting" circle></el-button>
  <img
    :src="userStore.avatar"
    style="width: 24px; height: 24px; margin: 0 10px; border-radius: 50%"
    alt="avatar"
  />
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="handleLogout">Logout</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
//引入layout设置相关小仓库
import useLayoutSettingStore from '@/store/modules/setting'
//引入用户数据相关仓库
import useUserStore from '@/store/modules/user'
//引入路由器对象
import { useRouter } from 'vue-router'
//引入路由对象
import { useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
//获取layout相关仓库
const layoutSettingStore = useLayoutSettingStore()
//获取用户数据相关仓库
const userStore = useUserStore()
//获取路由器对象
const $router = useRouter()
//获取路由对象
const $route = useRoute()
//点击刷新按钮回调
const handleRefresh = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh
}
//切换全屏模式的回调
const handleFullScreen = () => {
  let isFullScreen = document.fullscreenElement
  if (isFullScreen) {
    document.exitFullscreen()
  } else {
    document.documentElement.requestFullscreen()
  }
}
//退出登录回调
const handleLogout = async () => {
  try {
    //清空用户相关仓库数据
    await userStore.userLogout()
    await $router.push({ path: '/login', query: { redirect: $route.path } })
    //退出登录成功弹出提示
    ElNotification({
      type: 'success',
      title: 'Logout success!',
      duration: 1000,
    })
  } catch (e) {
    //退出登录失败弹出错误提示
    ElNotification({
      type: 'error',
      title: 'Logout failed!',
      duration: 1000,
      message: (e as Error).message,
    })
  }
}
</script>
<script lang="ts">
export default {
  name: 'Settings',
}
</script>

<style lang="scss" scoped></style>

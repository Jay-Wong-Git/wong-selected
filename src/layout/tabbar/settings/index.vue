<template>
  <el-button size="small" icon="Refresh" circle @click="handleRefresh" />
  <el-button size="small" icon="FullScreen" circle @click="handleFullScreen" />
  <el-button size="small" icon="Setting" circle @click="handleSetting" />
  <img
    :src="userStore.avatar"
    style="width: 24px; height: 24px; margin: 0 10px; border-radius: 50%"
    alt="avatar"
  />
  <!-- 设置抽屉 -->
  <el-drawer
    size="24%"
    v-model="settingDrawerVisible"
    direction="rtl"
    title="Theme Settings"
  >
    <el-form label-width="100px">
      <el-form-item label="Theme Color">
        <el-color-picker
          v-model="color"
          show-alpha
          @change="handleThemeColorChange"
          :predefine="predefineColors"
        />
      </el-form-item>
      <el-form-item label="Dark Mode">
        <el-switch
          v-model="darkMode"
          active-icon="Moon"
          inline-prompt
          active-color="black"
          inactive-icon="Sunny"
          inactive-color="orange"
          @change="handleDarkMode"
        />
      </el-form-item>
    </el-form>
  </el-drawer>
  <!-- 退出登录下拉框 -->
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
import { ref } from 'vue'
import { Moon, Sunny } from '@element-plus/icons-vue'
//获取layout相关仓库
const layoutSettingStore = useLayoutSettingStore()
//获取用户数据相关仓库
const userStore = useUserStore()
//获取路由器对象
const $router = useRouter()
//获取路由对象
const $route = useRoute()
//控制设置抽屉显示与隐藏
const settingDrawerVisible = ref<boolean>(false)
//暗黑模式开关,false：关闭暗黑模式，true：打开暗黑模式
const darkMode = ref<boolean>(false)
//主题颜色配置
const color = ref('rgba(255, 255, 255, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
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
//点击设置按钮回调
const handleSetting = () => {
  //显示抽屉
  settingDrawerVisible.value = true
}
//点击切换暗黑模式开关回调
const handleDarkMode = () => {
  //获取html根节点
  const html = document.documentElement
  html.className = darkMode.value ? 'dark' : ''
}
//点击切换主题颜色回调
const handleThemeColorChange = () => {
  const html = document.documentElement
  html.style.setProperty('--el-color-primary', color.value)
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

<template>
  <div>
    <el-card>
      <div class="greet-wrapper">
        <img :src="userStore.avatar" alt="avatar" />
        <div class="greet-info">
          <h1 class="greet-words">
            {{ greetWords }}
          </h1>
          <div class="platform-name">{{ settings.title }}</div>
        </div>
      </div>
    </el-card>
    <div class="svg-wrapper">
      <svg-icon name="welcome" width="600px" height="600px"></svg-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
//引入用户数据相关的仓库
import useUserStore from '@/store/modules/user'
import { computed, onMounted } from 'vue'
import { ElNotification } from 'element-plus'
import { getTime } from '@/utils/time'
import settings from '@/settings'
//使用用户数据相关的仓库
const userStore = useUserStore()
//问候语
const greetWords = computed(() => {
  return 'Good ' + getTime() + ', ' + userStore.username + '!'
})
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

<style lang="scss" scoped>
.greet-wrapper {
  display: flex;
  img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }
  .greet-info {
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: space-evenly;
    margin-left: 30px;
    .greet-words {
      font-size: 40px;
    }
    .platform-name {
      font-style: italic;
      font-size: 20px;
      opacity: 60%;
    }
  }
}
.svg-wrapper {
  display: flex;
  justify-content: center;
}
</style>

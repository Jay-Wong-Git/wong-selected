<template>
  <div class="logo_container">
    <img :src="settings.logo" alt="logo" v-if="!settings.logoHidden" />
    <p>{{ settings.title }}</p>
  </div>
</template>

<script setup lang="ts">
//引入配置logo和标题的配置文件
import settings from '@/settings'
//引入layout设置相关小仓库
import useLayoutSettingStore from '@/store/modules/setting'
const layoutSettingStore = useLayoutSettingStore()
</script>
<script lang="ts">
export default {
  name: 'Logo',
}
</script>

<style lang="scss" scoped>
.logo_container {
  display: flex;
  height: $base-menu-logo-height;
  width: 100%;
  align-items: end;
  justify-content: space-around;
  img {
    height: 40px;
  }
  p {
    color: white;
    font-size: 20px;
  }
}
</style>

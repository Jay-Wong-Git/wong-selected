<template>
  <div class="logo_container" v-if="!settings.logoHidden">
    <img :src="settings.logo" alt="logo" />
    <p>{{ settings.title }}</p>
  </div>
</template>

<script setup lang="ts">
//引入配置logo和标题的配置文件
import settings from '@/settings'
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

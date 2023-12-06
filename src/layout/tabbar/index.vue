<template>
  <!-- 顶部tab -->
  <div class="tabbar">
    <!--  顶部tab左侧 -->
    <div class="tabbar_left">
      <Breadcrumb />
    </div>
    <!--  顶部tab右侧 -->
    <div class="tabbar_right">
      <Settings />
    </div>
  </div>
</template>

<script setup lang="ts">
//左侧面包屑组件Breadcrumb
import Breadcrumb from './breadcrumb/index.vue'
//右侧设置组件Settings
import Settings from './settings/index.vue'
</script>

<style lang="scss" scoped>
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-image: linear-gradient(to right, #f1e3e3, #9e839e, #ded0d5);
  .tabbar_left {
    display: flex;
    margin-left: 10px;
  }
  .tabbar_right {
    display: flex;
    align-items: center;
  }
}
</style>

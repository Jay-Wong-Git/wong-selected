<template>
  <div class="layout_container">
    <!--  左侧菜单  -->
    <div class="layout_side">side</div>
    <!--  顶部导航  -->
    <div class="layout_top">top</div>
    <!--  内容展示  -->
    <div class="layout_main">
      <div style="height: 1000px; background: #535bf2"></div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.layout_container {
  width: 100%;
  height: 100vh;
  .layout_side {
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
  }
  .layout_top {
    position: absolute;
    top: 0;
    left: $base-menu-width;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    background: #95d475;
  }
  .layout_main {
    position: absolute;
    top: $base-tabbar-height;
    left: $base-menu-width;
    height: calc(100vh - $base-tabbar-height);
    width: calc(100% - $base-menu-width);
    background: hotpink;
    padding: 20px;
    overflow: auto;
  }
}
</style>

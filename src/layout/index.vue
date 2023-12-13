<template>
  <div class="layout_container">
    <!--  左侧菜单  -->
    <div class="layout_side">
      <Logo />
      <!--   滚动条组件   -->
      <el-scrollbar class="scrollbar">
        <!--    菜单组件    -->
        <el-menu
          background-color="#483469"
          text-color="white"
          :default-active="$route.path"
          :collapse="layoutSettingStore.isFolded"
        >
          <!--     根据路由动态生成组件     -->
          <Menu :menuList="userStore.constRoutes" />
        </el-menu>
      </el-scrollbar>
    </div>
    <!--  顶部导航  -->
    <div class="layout_top" :class="{ fold: layoutSettingStore.isFolded }">
      <Tabbar />
    </div>
    <!--  内容展示  -->
    <div class="layout_main" :class="{ fold: layoutSettingStore.isFolded }">
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts">
//获取路由对象
import { useRoute } from 'vue-router'
//Logo组件
import Logo from './logo/index.vue'
//Menu组件
import Menu from './menu/index.vue'
//Main内容展示组件
import Main from './main/index.vue'
//Tabbar组件
import Tabbar from './tabbar/index.vue'
//引入用户相关的小仓库
import useUserStore from '@/store/modules/user'
//引入layout设置相关小仓库
import useLayoutSettingStore from '@/store/modules/setting'
const userStore = useUserStore()
const layoutSettingStore = useLayoutSettingStore()

const $route = useRoute()
</script>
<script lang="ts">
export default {
  name: 'Layout',
}
</script>

<style lang="scss" scoped>
.layout_container {
  width: 100%;
  height: 100vh;
  .layout_side {
    color: white;
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
    transition: all 0.3s;
    overflow: hidden;
    .scrollbar {
      height: calc(100vh - $base-menu-logo-height);
      width: 100%;
      .el-menu {
        border-right: none;
      }
    }
    //&.fold {
    //  width: $base-permission-min-width;
    //}
  }
  .layout_top {
    position: absolute;
    top: 0;
    left: $base-menu-width;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    transition: all 0.3s;
    &.fold {
      width: calc(100% - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
  .layout_main {
    position: absolute;
    top: $base-tabbar-height;
    left: $base-menu-width;
    height: calc(100vh - $base-tabbar-height);
    width: calc(100% - $base-menu-width);
    background: white;
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;
    &.fold {
      width: calc(100% - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
}
</style>

<template>
  <template v-for="item in menuList" :key="item.path">
    <!--  没有子路由  -->
    <el-menu-item
      v-if="!item.children && !item.meta.hidden"
      :index="item.path"
      @click="goRoute"
    >
      <el-icon>
        <component :is="item.meta.icon" />
      </el-icon>
      <template #title>
        <span>{{ item.meta.title }}</span>
      </template>
    </el-menu-item>
    <!--  有且仅有一个子路由  -->
    <el-menu-item
      v-if="
        item.children &&
        item.children.length === 1 &&
        !item.children[0].meta.hidden
      "
      :index="item.children[0].path"
      @click="goRoute"
    >
      <el-icon>
        <component :is="item.children[0].meta.icon" />
      </el-icon>
      <template #title>
        <span>{{ item.children[0].meta.title }}</span>
      </template>
    </el-menu-item>
    <!--  有多个子路由  -->
    <el-sub-menu
      v-if="item.children && item.children.length > 1 && !item.meta.hidden"
      :index="item.path"
    >
      <template #title>
        <el-icon>
          <component :is="item.meta.icon" />
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <Menu :menuList="item.children" />
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
defineProps(['menuList'])
const $router = useRouter()
//点击跳转路由
const goRoute = (vc:any) => {
  $router.push(vc.index)
}
</script>

<script lang="ts">
export default {
  name: 'Menu',
}
</script>

<style lang="scss" scoped></style>

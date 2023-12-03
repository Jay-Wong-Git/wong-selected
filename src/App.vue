<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
</script>
const obj ={name:"Andy"}
<template>
  <div class="test">Vue3-Admin-Template2</div>
  <el-button type="primary" plain :icon="Plus">primary</el-button>
</template>

<style scoped lang="scss">
.test {
  width: 200px;
}
</style>

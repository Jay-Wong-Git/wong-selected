<template>
  <el-card>
    <el-form inline>
      <el-form-item label="Level 1">
        <el-select
          v-model="categoryStore.level1Id"
          @change="handleLevel1Change"
          :disabled="scene !== 0"
        >
          <el-option
            v-for="item in categoryStore.level1Arr"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Level 2">
        <el-select
          v-model="categoryStore.level2Id"
          :disabled="scene !== 0"
          @change="handleLevel2Change"
        >
          <el-option
            v-for="item in categoryStore.level2Arr"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Level 3">
        <el-select v-model="categoryStore.level3Id" :disabled="scene !== 0">
          <el-option
            v-for="item in categoryStore.level3Arr"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { reqLevel1, reqLevel2, reqLevel3 } from '@/api/product/attr'
import { ElMessage } from 'element-plus'
//引入分类信息相关小仓库
import useCategoryStore from '@/store/modules/category'
//使用分类信息小仓库
const categoryStore = useCategoryStore()
//接收父组件传递的属性值
defineProps(['scene'])

//组件挂载完毕立即请求一级分类接口
onMounted(() => {
  categoryStore.getLevel1Data()
})
//一级分类选择完毕立即请求二级分类接口
const handleLevel1Change = (id: number) => {
  categoryStore.level2Id = undefined
  categoryStore.level3Id = undefined
  categoryStore.getLevel2Data(id)
}
//二级分类选择完毕立即请求三级分类接口
const handleLevel2Change = (id: number) => {
  categoryStore.level3Id = undefined
  categoryStore.getLevel3Data(id)
}
</script>

<style lang="scss" scoped></style>

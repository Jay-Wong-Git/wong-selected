<template>
  <div>
    <!--  引入三级分类全局组件  -->
    <Category :scene="scene" />
    <el-card style="margin-top: 15px">
      <!--   展示已有SPU列表   -->
      <div v-show="scene === 0">
        <el-button
          icon="Plus"
          type="primary"
          @click="handleAddSPU"
          :disabled="!categoryStore.level3Id"
        >
          Add SPU
        </el-button>
        <el-table style="margin: 15px 0" border :data="spuArr">
          <el-table-column
            type="index"
            label="No."
            width="80px"
            align="center"
          />
          <el-table-column label="SPU Name" width="150px" prop="spuName" />
          <el-table-column
            label="SPU Desc"
            prop="description"
            show-overflow-tooltip
          />
          <el-table-column label="Operation" width="220px">
            <template v-slot="{ row }">
              <el-button
                size="small"
                type="primary"
                icon="Plus"
                title="Add SKU"
                @click="handleAddSKU(row)"
              />
              <el-button
                size="small"
                type="warning"
                icon="Edit"
                title="Edit SPU"
                @click="handleUpdateSPU(row)"
              />
              <el-button
                size="small"
                type="success"
                icon="View"
                title="View SKU List"
              />
              <el-button
                size="small"
                type="danger"
                icon="Delete"
                title="Delete SPU"
              />
            </template>
          </el-table-column>
        </el-table>
        <!--  分页器  -->
        <el-pagination
          v-model:current-page="pageNum"
          v-model:page-size="pageSize"
          :page-sizes="[3, 6, 9]"
          background
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="getSPU"
        />
      </div>
      <!--   添加或修改SPU表单   -->
      <SpuForm
        ref="spuFormRef"
        v-show="scene === 1"
        @changeScene="changeScene"
      />
      <!--   添加SKU表单   -->
      <SkuForm
        ref="skuFormRef"
        v-show="scene === 2"
        @changeScene="changeScene"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
//引入分类相关仓库
import useCategoryStore from '@/store/modules/category'
import { reqSPU } from '@/api/product/spu'
import { SpuData, SpuResponseData } from '@/api/product/spu/type'
import SpuForm from '@/views/product/spu/spuForm.vue'
import SkuForm from '@/views/product/spu/skuForm.vue'
//定义卡片内容切换变量：0表示展示已有SPU，1表示添加或修改SPU，2表示添加SKU
let scene = ref<number>(0)
//当前页码
let pageNum = ref<number>(1)
//每页显示条数
let pageSize = ref<number>(3)
//数据总条数
let total = ref<number>(0)
//存储已有的SPU数据
let spuArr = ref<SpuData[]>([])
//获取Spu子组件实例
const spuFormRef = ref<any>()
//获取Sku子组件实例
const skuFormRef = ref<any>()
//使用分类仓库数据
const categoryStore = useCategoryStore()
//监听三级分类id变化，发送请求SPU数据
watch(
  () => categoryStore.level3Id,
  () => {
    //确保有三级分类id才会发送请求
    if (!categoryStore.level3Id) return
    getSPU()
  },
)
//组件销毁前清空仓库中相关数据
onBeforeUnmount(() => {
  categoryStore.$reset()
})
//获取指定三级分类下的已有SPU的数据
const getSPU = async (page: number = 1) => {
  pageNum.value = page
  try {
    const res: SpuResponseData = await reqSPU(
      pageNum.value,
      pageSize.value,
      categoryStore.level3Id as number,
    )
    if (res.code === 200) {
      spuArr.value = res.data.records
      total.value = res.data.total
    }
  } catch (e) {}
}
//点击添加SPU按钮回调
const handleAddSPU = () => {
  //切换至添加或编辑SPU表单页面
  scene.value = 1
  //调用子组件初始化方法
  spuFormRef.value.initAddSpuFormData(categoryStore.level3Id as number)
}
//点击编辑SPU按钮回调
const handleUpdateSPU = (row: SpuData) => {
  //切换至添加或编辑SPU表单页面
  scene.value = 1
  //调用子组件初始化方法
  spuFormRef.value.initUpdateSpuFormData(row)
}
//点击添加SKU按钮回调
const handleAddSKU = (spu: SpuData) => {
  //切换至添加SKU表单页面
  scene.value = 2
  //调用子组件初始化方法
  skuFormRef.value.initAddSkuFormData(
    categoryStore.level1Id as number,
    categoryStore.level2Id as number,
    spu,
  )
}
//每页显示数据切换回调
const handleSizeChange = (size: number) => {
  pageSize.value = size
  getSPU()
}
//将场景切换为默认场景展示已有SPU
const changeScene = (obj: { scene: number; type: string }) => {
  scene.value = obj.scene
  if (obj.type === 'update') {
    //更新时保持在当前页
    getSPU(pageNum.value)
  }
  if (obj.type === 'add') {
    //添加时请求第一页
    getSPU()
  }
}
</script>

<style lang="scss" scoped></style>

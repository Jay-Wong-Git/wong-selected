<template>
  <el-card class="box-card">
    <!--  添加品牌按钮  -->
    <el-button icon="Plus">Add a Trademark</el-button>
    <!--  用于展示的表格组件  -->
    <el-table style="margin: 10px 0" border :data="trademarkList">
      <el-table-column
        label="No."
        width="80px"
        align="center"
        type="index"
      ></el-table-column>
      <el-table-column label="Trademark" prop="tmName"></el-table-column>
      <el-table-column label="Logo">
        <!--  使用作用域插槽  -->
        <template v-slot="{ row }">
          <img
            :src="
              row.logoUrl.startsWith('http')
                ? row.logoUrl
                : 'http://' + row.logoUrl
            "
            alt="logo"
            style="width: 60px"
          />
        </template>
      </el-table-column>
      <el-table-column label="Operation">
        <template v-slot="">
          <el-button type="primary" size="small" icon="Edit" />
          <el-button type="primary" size="small" icon="Delete" />
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
      @current-change="handleGetTrademark"
    />
  </el-card>
</template>

<script setup lang="ts">
import {onMounted, onUpdated, reactive, ref} from 'vue'
import { reqTrademark } from '@/api/product/trademark'
import { Records, TrademarkResponseData } from '@/api/product/trademark/type'
//当前页码
let pageNum = ref<number>(1)
//每页显示条数
let pageSize = ref<number>(3)
//数据总条数
let total = ref<number>(0)
//当前获取到的品牌详细信息
let trademarkList = ref<Records>([])
//获取品牌数据
const handleGetTrademark = async (page = 1) => {
  pageNum.value = page
  const res: TrademarkResponseData = await reqTrademark(
    pageNum.value,
    pageSize.value,
  )
  if (res.code === 200) {
    total.value = res.data.total
    trademarkList.value = res.data.records
    // console.log(trademarkList)
  }
}
//组件挂载完毕后默认请求第1页共3条品牌数据
onMounted(() => {
  handleGetTrademark()
})

onUpdated(()=>{
  console.log(trademarkList)
})
//更改每页显示条数回调
const handleSizeChange = () => {
  handleGetTrademark()
}
</script>

<style lang="scss" scoped></style>

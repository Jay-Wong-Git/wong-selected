<template>
  <el-card>
    <!--  表格展示SKU数据  -->
    <el-table border :data="skuArr" style="margin-bottom: 15px">
      <el-table-column type="index" width="80px" label="No." align="center" />
      <el-table-column
        label="Name"
        show-overflow-tooltip
        width="250px"
        prop="skuName"
      />
      <el-table-column
        label="Desc"
        show-overflow-tooltip
        width="250px"
        prop="skuDesc"
      />
      <el-table-column label="Picture" width="200px">
        <template v-slot="{ row }">
          <img
            :src="row.skuDefaultImg"
            :alt="row.skuName"
            style="width: 100px; height: 100px"
          />
        </template>
      </el-table-column>
      <el-table-column label="Weight(g)" prop="weight" width="150px" />
      <el-table-column label="Price(RMB)" prop="price" width="150px" />
      <el-table-column label="Operation" width="220px" fixed="right">
        <template v-slot="{ row }">
          <el-button
            :type="row.isSale === 0 ? 'primary' : 'info'"
            size="small"
            :icon="row.isSale === 0 ? 'Top' : 'Bottom'"
            @click="handleSkuOnSaleAndCancelSale(row)"
          />
          <el-button type="warning" size="small" icon="Edit" />
          <el-button type="success" size="small" icon="View" />
          <el-popconfirm
            width="250px"
            icon="Delete"
            icon-color="#409EFFFF"
            :title="`Are your sure to delete '${row.skuName}'`"
            @confirm="handleDeleteSKU(row)"
          >
            <template #reference>
              <el-button type="danger" size="small" icon="Delete" />
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!--  分页器  -->
    <el-pagination
      v-model:current-page="pageNum"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30]"
      background
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @current-change="getSKU"
      @size-change="handleSizeChange"
    />
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  reqDeleteSku,
  reqSku,
  reqSkuCancelSale,
  reqSkuOnSale,
} from '@/api/product/sku'
import { ElMessage } from 'element-plus'
import { SkuData } from '@/api/product/sku/type'
//第几页
const pageNum = ref<number>(1)
//每页几条数据
const pageSize = ref<number>(10)
//一共多少页
const total = ref<number>(0)
//保存SKU数据
const skuArr = ref<SkuData[]>([])
//组件一挂载就立即加载默认数据
onMounted(() => {
  getSKU()
})
//获取SKU数据回调
const getSKU = async (page: number = 1) => {
  pageNum.value = page
  try {
    const res = await reqSku(pageNum.value, pageSize.value)
    if (res.code === 200) {
      skuArr.value = res.data.records
      total.value = res.data.total
    } else {
      throw new Error('Init Data Failed!')
    }
  } catch (e) {
    ElMessage.error({
      duration: 2000,
      message: (e as Error).message,
    })
  }
}
//改变每页显示条数回调
const handleSizeChange = (size: number) => {
  pageSize.value = size
  getSKU()
}
//点击删除SKU按钮回调
const handleDeleteSKU = async (skuId: number) => {
  try {
    const res = await reqDeleteSku(skuId)
    if (res.code === 200) {
      if (pageSize.value === 1 && pageNum.value !== 1) {
        await getSKU(pageNum.value - 1)
      } else {
        await getSKU(pageNum.value)
      }
      //提示删除成功
      ElMessage.success({
        duration: 2000,
        message: 'Delete SKU Success!',
      })
    } else {
      throw new Error('Delete SKU Failed!')
    }
  } catch (e) {
    ElMessage.error({
      duration: 2000,
      message: (e as Error).message,
    })
  }
}
//点击SKU上架或下架按钮回调
const handleSkuOnSaleAndCancelSale = async (sku: SkuData) => {
  try {
    //0表示目前是下架状态，准备发送请求上架SKU
    if (sku.isSale === 0) {
      const res = await reqSkuOnSale(sku.id as number)
      if (res.code === 200) {
        //重新获取SKU数据
        await getSKU(pageNum.value)
        //发送成功提示
        ElMessage.success({
          duration: 2000,
          message: 'Listed Successfully!',
        })
      } else {
        throw new Error('Listing Failed!')
      }
    } else {
      //非0表示目前是上架状态，准备发送请求下架SKU
      const res = await reqSkuCancelSale(sku.id as number)
      if (res.code === 200) {
        //重新获取SKU数据
        await getSKU(pageNum.value)
        //发送成功提示
        ElMessage.success({
          duration: 2000,
          message: 'Delisted Successfully!',
        })
      } else {
        throw new Error('Delisting Failed!')
      }
    }
  } catch (e) {
    ElMessage.error({
      duration: 2000,
      message: (e as Error).message,
    })
  }
}
</script>

<style lang="scss" scoped></style>

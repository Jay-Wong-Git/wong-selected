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
            :title="row.isSale === 0 ? 'Click to List' : 'Click to Delist'"
          />
          <el-button disabled type="warning" size="small" icon="Edit" />
          <el-button
            type="success"
            size="small"
            icon="View"
            @click="handleViewSKU(row.id)"
            title="View SKU"
          />
          <el-popconfirm
            width="250px"
            icon="Delete"
            icon-color="#409EFFFF"
            :title="`Are your sure to delete '${row.skuName}'`"
            @confirm="handleDeleteSKU(row)"
          >
            <template #reference>
              <el-button
                type="danger"
                size="small"
                icon="Delete"
                title="Delete SKU"
              />
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
    <!--  抽屉组件用于显示SKU详情  -->
    <el-drawer
      v-model="drawer"
      direction="rtl"
      title="View SKU Detail"
      size="50%"
      @close="handleDrawerClose"
    >
      <template #default>
        <el-row style="margin: 15px 0">
          <el-col :span="8">SKU Name</el-col>
          <el-col :span="16">{{ skuView.skuName }}</el-col>
        </el-row>
        <el-row style="margin: 15px 0">
          <el-col :span="8">SKU Desc</el-col>
          <el-col :span="16">{{ skuView.skuDesc }}</el-col>
        </el-row>
        <el-row style="margin: 15px 0">
          <el-col :span="8">SKU Price</el-col>
          <el-col :span="16">{{ '¥ ' + skuView.price }}</el-col>
        </el-row>
        <el-row style="margin: 15px 0">
          <el-col :span="8">Platform Attr</el-col>
          <el-col :span="16">
            <el-tag
              style="margin: 0 5px 5px 0"
              v-for="(item, index) in skuView.skuAttrValueList"
              :key="item.id"
              size="small"
              effect="plain"
              :type="
                index % 5 === 0
                  ? 'success'
                  : index % 5 === 1
                    ? ''
                    : index % 5 === 2
                      ? 'warning'
                      : index % 5 === 3
                        ? 'danger'
                        : 'info'
              "
            >
              {{ item.valueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 15px 0">
          <el-col :span="8">Sale Attr</el-col>
          <el-col :span="16">
            <el-tag
              style="margin: 0 5px 5px 0"
              :key="item.id"
              v-for="(item, index) in skuView.skuSaleAttrValueList"
              size="small"
              effect="plain"
              :type="
                index % 5 === 0
                  ? 'success'
                  : index % 5 === 1
                    ? ''
                    : index % 5 === 2
                      ? 'warning'
                      : index % 5 === 3
                        ? 'danger'
                        : 'info'
              "
            >
              {{ item.saleAttrValueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 15px 0">
          <el-col :span="8">Pictures</el-col>
          <el-col :span="16">
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item
                v-for="item in skuView.skuImageList"
                :key="item.id"
              >
                <img
                  :src="item.imgUrl"
                  :alt="item.imgName"
                  style="width: 100%; height: 100%"
                />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import {
  reqDeleteSku,
  reqAllSku,
  reqSkuCancelSale,
  reqSkuOnSale,
  reqSku,
} from '@/api/product/sku'
import { ElMessage } from 'element-plus'
import { SkuData } from '@/api/product/sku/type'
//第几页
const pageNum = ref<number>(1)
//每页几条数据
const pageSize = ref<number>(10)
//一共多少页
const total = ref<number>(0)
//保存SKU列表数据
const skuArr = ref<SkuData[]>([])
//保存指定展示SKU数据
const skuView = reactive<SkuData>({
  skuName: '',
  skuDesc: '',
  weight: undefined,
  price: undefined,
  isSale: 0,
  skuAttrValueList: [],
  skuDefaultImg: '',
  skuImageList: [],
  skuSaleAttrValueList: [],
  category3Id: undefined,
  spuId: undefined,
  tmId: undefined,
})
//控制抽屉的显示与隐藏
const drawer = ref<boolean>(false)
//组件一挂载就立即加载默认数据
onMounted(() => {
  getSKU()
})
//获取SKU数据回调
const getSKU = async (page: number = 1) => {
  pageNum.value = page
  try {
    const res = await reqAllSku(pageNum.value, pageSize.value)
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
      if (skuArr.value.length === 1 && pageNum.value !== 1) {
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
//点击查看SKU详情回调
const handleViewSKU = async (skuId: number) => {
  //清空旧数据
  Object.assign(skuView, {
    skuName: '',
    skuDesc: '',
    weight: undefined,
    price: undefined,
    isSale: 0,
    skuAttrValueList: [],
    skuDefaultImg: '',
    skuImageList: [],
    skuSaleAttrValueList: [],
    category3Id: undefined,
    spuId: undefined,
    tmId: undefined,
  })
  try {
    //发送请求获取指定SKU数据
    const res = await reqSku(skuId)
    if (res.code === 200) {
      Object.assign(skuView, res.data)
      //打开抽屉
      drawer.value = true
    } else {
      throw new Error('Loading Failed!')
    }
  } catch (e) {
    ElMessage.error({
      duration: 2000,
      message: (e as Error).message,
    })
  }
}
//关闭抽屉回调
const handleDrawerClose = () => {}
</script>

<style lang="scss" scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>

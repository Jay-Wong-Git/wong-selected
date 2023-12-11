<template>
  <el-form label-width="100px">
    <el-form-item label="SKU Name:">
      <el-input v-model="skuParams.skuName" />
    </el-form-item>
    <el-form-item label="Price(RMB):">
      <el-input type="number" v-model="skuParams.price" />
    </el-form-item>
    <el-form-item label="Weight(g):">
      <el-input type="number" v-model="skuParams.weight" />
    </el-form-item>
    <el-form-item label="SKU Desc:">
      <el-input type="textarea" v-model="skuParams.skuDesc" />
    </el-form-item>
    <el-form-item label="Platform Attr:">
      <el-form inline label-width="90px">
        <el-form-item
          v-for="item in platformAttrArr"
          :label="item.attrName + ':'"
          :key="item.id"
        >
          <el-select v-model="item.attrIdAndValueId">
            <el-option
              v-for="attrValue in item.attrValueList"
              :label="attrValue.valueName"
              :value="`${item.id}:${attrValue.id}`"
              :key="attrValue.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="Sale Attr:">
      <el-form label-width="90px">
        <el-form-item
          v-for="item in spuSaleAttrArr"
          :label="item.saleAttrName"
          :key="item.id"
        >
          <el-select v-model="item.saleAttrIdAndValueId">
            <el-option
              v-for="value in item.spuSaleAttrValueList"
              :label="value.saleAttrValueName"
              :key="value.id"
              :value="`${item.id}:${value.id}`"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="Picture:">
      <el-table border :data="spuPictureArr" ref="tableRef">
        <el-table-column
          type="selection"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column label="Picture">
          <template v-slot="{ row }">
            <img
              :src="row.imgUrl"
              :alt="row.imgName"
              style="height: 100px; width: 100px"
            />
          </template>
        </el-table-column>
        <el-table-column label="Name" prop="imgName"></el-table-column>
        <el-table-column label="Operation">
          <template v-slot="{ row }">
            <el-button
              v-if="skuParams.skuDefaultImg !== row.imgUrl"
              size="small"
              type="primary"
              @click="handleSetDefault(row)"
            >
              Set as default
            </el-button>
            <el-button v-else size="small" type="success" disabled>
              Default
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        style="width: 75px"
        @click="handleConfirmAddSKU"
      >
        Save
      </el-button>
      <el-button type="warning" style="width: 75px" @click="handleCancelAddSKU">
        Cancel
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
//自定义事件
import {
  SaleAttr,
  SkuData,
  SpuData,
  SpuPicture,
  SpuPictureResponseData,
  SpuSaleAttrResponseData,
} from '@/api/product/spu/type'
import { reqAttr } from '@/api/product/attr'
import { reqAddSKU, reqSpuPicture, reqSpuSaleAttr } from '@/api/product/spu'
import { reactive, ref } from 'vue'
import { Attribute } from '@/api/product/attr/type'
import { ElMessage } from 'element-plus'
//存储平台属性
const platformAttrArr = ref<Attribute[]>([])
//存储SPU销售属性
const spuSaleAttrArr = ref<SaleAttr[]>([])
//存储SPU照片
const spuPictureArr = ref<SpuPicture[]>([])
//收集SKU相关参数
const skuParams = reactive<SkuData>({
  skuName: '',
  skuDesc: '',
  weight: undefined,
  price: undefined,
  skuAttrValueList: [],
  skuDefaultImg: '',
  skuSaleAttrValueList: [],
  category3Id: undefined,
  spuId: undefined,
  tmId: undefined,
})
//获取table组件实例
const tableRef = ref<any>()
const $emit = defineEmits(['changeScene'])
//添加一个SKU时初始化SKU数据
const initAddSkuFormData = async (
  level1Id: number,
  level2Id: number,
  spu: SpuData,
) => {
  //清空旧数据
  Object.assign(skuParams, {
    skuName: '',
    skuDesc: '',
    weight: undefined,
    price: undefined,
    skuAttrValueList: [],
    skuDefaultImg: '',
    skuSaleAttrValueList: [],
    category3Id: undefined,
    spuId: undefined,
    tmId: undefined,
  })
  spuSaleAttrArr.value = []
  spuPictureArr.value = []
  platformAttrArr.value = []
  //初始化SKU对象
  skuParams.spuId = spu.id
  skuParams.category3Id = spu.category3Id
  skuParams.tmId = spu.tmId
  try {
    //发送请求获取平台属性
    const resPlatformAttr = await reqAttr(
      level1Id,
      level2Id,
      spu.category3Id as number,
    )
    platformAttrArr.value = resPlatformAttr.data
    //发送请求获取销售属性
    const resSpuSaleAttr: SpuSaleAttrResponseData = await reqSpuSaleAttr(
      spu.id as number,
    )
    spuSaleAttrArr.value = resSpuSaleAttr.data
    //发送请求获取图片
    const resSpuPicture: SpuPictureResponseData = await reqSpuPicture(
      spu.id as number,
    )
    spuPictureArr.value = resSpuPicture.data
  } catch (e) {
    ElMessage.error({
      duration: 2000,
      message: (e as Error).message,
    })
  }
}
//点击设置图片为默认回调
const handleSetDefault = (spuPicture: SpuPicture) => {
  //设置为全部未选中
  spuPictureArr.value.forEach((item) => {
    tableRef.value.toggleRowSelection(item, false)
  })
  //设置点击按钮所在行选中
  tableRef.value.toggleRowSelection(spuPicture, true)
  skuParams.skuDefaultImg = spuPicture.imgUrl as string
}
//点击保存按钮回调
const handleConfirmAddSKU = async () => {
  //整理SKU参数
  //整理平台属性(使用forEach)
  platformAttrArr.value.forEach((item) => {
    if (item.attrIdAndValueId) {
      const [attrId, valueId] = item.attrIdAndValueId.split(':')
      skuParams.skuAttrValueList.push({ attrId: +attrId, valueId: +valueId })
    }
  })
  //整理销售属性(使用reduce)
  skuParams.skuSaleAttrValueList = spuSaleAttrArr.value.reduce(
    (prev: any, next: any) => {
      if (next.saleAttrIdAndValueId) {
        const [saleAttrId, saleAttrValueId] =
          next.saleAttrIdAndValueId.split(':')
        prev.push({
          saleAttrId: +saleAttrId,
          saleAttrValueId: +saleAttrValueId,
        })
      }
      return prev
    },
    [],
  )
  //发送添加SKU请求
  try {
    const res = await reqAddSKU(skuParams)
    if (res.code === 200) {
      //添加成功提示信息
      ElMessage.success({
        duration: 2000,
        message: 'Add SKU Success!',
      })
      //切换场景
      $emit('changeScene', { scene: 0, type: '' })
    } else {
      throw new Error('Add SKU Failed!')
    }
  } catch (e) {
    ElMessage.error({
      duration: 2000,
      message: (e as Error).message,
    })
  }
}
//点击取消添加SKU按钮回调
const handleCancelAddSKU = () => {
  //切换场景
  $emit('changeScene', { scene: 0, type: '' })
}
//向外暴露，父组件中通过子组件实例可以访问到
defineExpose({ initAddSkuFormData })
</script>

<style lang="scss" scoped></style>

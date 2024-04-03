<template>
  <el-form label-width="110px">
    <el-form-item label="SPU Name:">
      <el-input
        placeholder="Please input SPU name"
        v-model="spuParams.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU Trademark:">
      <el-select v-model="spuParams.tmId">
        <el-option
          v-for="item in allTrademark"
          :key="item.id"
          :value="item.id"
          :label="item.tmName"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="SPU Desc:">
      <el-input
        type="textarea"
        placeholder="Please input SPU description..."
        v-model="spuParams.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU Picture:">
      <el-upload
        v-model:file-list="spuPictureArr"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :before-upload="handlePictureBeforeUpload"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
      >
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img :src="dialogImageUrl" alt="Preview Image" style="width: 100%" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU Sale Attr:">
      <el-select
        v-model="unSelectedAttrIdAndAttrName"
        :placeholder="
          unSelectedSaleAttr.length
            ? unSelectedSaleAttr.length + ' Unselected'
            : 'None'
        "
      >
        <el-option
          v-for="item in unSelectedSaleAttr"
          :label="item.name"
          :value="`${item.id}:${item.name}`"
          :key="item.id"
        />
      </el-select>
      <el-button
        :disabled="!unSelectedAttrIdAndAttrName"
        icon="Plus"
        type="primary"
        style="margin-left: 15px"
        @click="handleAddSaleAttr"
      >
        Add Sale Attr
      </el-button>
      <el-table border style="margin-top: 15px" :data="spuSaleAttrArr">
        <el-table-column label="No." width="80px" type="index" align="center" />
        <el-table-column label="Attr Name" width="100px" prop="saleAttrName" />
        <el-table-column label="Attr Values">
          <!--          @close="handleAttrValueTagClose(item)"-->
          <template v-slot="{ row, $index }">
            <el-tag
              closable
              effect="plain"
              v-for="(item, index) in row.spuSaleAttrValueList"
              style="margin: 5px"
              :key="item.id"
              @close="row.spuSaleAttrValueList.splice(index, 1)"
              :type="
                index % 5 === 0
                  ? ''
                  : index % 5 === 1
                    ? 'success'
                    : index % 5 === 2
                      ? 'warning'
                      : index % 5 === 3
                        ? 'info'
                        : 'danger'
              "
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input
              v-if="row.flag === true"
              v-model="row.saleAttrValue"
              placeholder="Input value"
              size="small"
              style="width: 80px; margin: 5px"
              :ref="(vc:any) => (inputRef = vc)"
              @blur="toUpdateAttrValueList(row)"
            />
            <el-button
              v-else
              size="small"
              style="margin: 5px"
              type="success"
              icon="Plus"
              title="Add an attr value"
              @click="toEditAttrValue(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="Operation" width="100px">
          <template v-slot="{ row, $index }">
            <el-popconfirm
              :title="`Are you sure to delete [${row.saleAttrName}]?`"
              width="250px"
              icon="Delete"
              icon-color="#409EFFFF"
              @confirm="spuSaleAttrArr.splice($index, 1)"
            >
              <template #reference>
                <el-button
                  type="danger"
                  size="small"
                  title="Delete the sale attr"
                  icon="Delete"
                />
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" style="width: 75px" @click="handleSaveSpuData">
        Save
      </el-button>
      <el-button
        type="warning"
        style="width: 75px"
        @click="handelCancelAddOrUpdateSPU"
      >
        Cancel
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import {
  AllTrademarkResponseData,
  BaseSaleAttr,
  BaseSaleAttrResponseData,
  SaleAttr,
  SpuData,
  SpuPicture,
  SpuPictureResponseData,
  SpuSaleAttrResponseData,
  Trademark,
} from '@/api/product/spu/type'
import {
  reqAddOrUpdateSpu,
  reqAllTrademark,
  reqBaseSaleAttr,
  reqSpuPicture,
  reqSpuSaleAttr,
} from '@/api/product/spu'
import { ElMessage, UploadProps } from 'element-plus'

const $emit = defineEmits(['changeScene'])
//存储SPU销售属性
const spuSaleAttrArr = ref<SaleAttr[]>([])
//存储SPU相关图片
const spuPictureArr = ref<SpuPicture[]>([])
//存储所有品牌
const allTrademark = ref<Trademark[]>([])
//存储基础销售属性
const baseSaleAttrArr = ref<BaseSaleAttr[]>([])
//存储SPU对象
const spuParams = ref<SpuData>({
  spuName: '',
  tmId: undefined,
  description: '',
  spuImageList: null,
  spuSaleAttrList: null,
  category3Id: undefined,
})
//存储未选择的销售属性id及属性名
const unSelectedAttrIdAndAttrName = ref<string>('')
//保存弹出框展示图片地址
const dialogImageUrl = ref<string>('')
//控制展示图片弹出框显示与隐藏
const dialogVisible = ref<boolean>(false)
//用于保存正在编辑的属性值输入框对象
const inputRef = ref<any>()
//添加一个SPU时初始化SPU数据
const initAddSpuFormData = async (level3Id: number) => {
  //清空数据
  Object.assign(spuParams.value, {
    spuName: '',
    tmId: undefined,
    description: '',
    spuImageList: null,
    spuSaleAttrList: null,
    category3Id: undefined,
  })
  spuSaleAttrArr.value = []
  spuPictureArr.value = []
  unSelectedAttrIdAndAttrName.value = ''
  //初始化数据
  spuParams.value.category3Id = level3Id
  try {
    //请求所有品牌
    const resAllTrademark: AllTrademarkResponseData = await reqAllTrademark()
    if (resAllTrademark.code === 200) {
      allTrademark.value = resAllTrademark.data
    }
    //请求基础销售属性
    const resBaseSaleAttr: BaseSaleAttrResponseData = await reqBaseSaleAttr()
    if (resBaseSaleAttr.code === 200) {
      baseSaleAttrArr.value = resBaseSaleAttr.data
    }
  } catch (e) {
    ElMessage.error({
      duration: 2000,
      message: (e as Error).message,
    })
  }
}
//更新一个SPU时初始化SPU数据
const initUpdateSpuFormData = async (spu: SpuData) => {
  //清空旧数据
  unSelectedAttrIdAndAttrName.value = ''
  //初始化数据
  spuParams.value = spu
  try {
    //请求SPU销售属性
    const resSpuSaleAttr: SpuSaleAttrResponseData = await reqSpuSaleAttr(
      spu.id as number,
    )
    if (resSpuSaleAttr.code === 200) {
      spuSaleAttrArr.value = resSpuSaleAttr.data
    }
    //请求SPU图片
    const resSpuPicture: SpuPictureResponseData = await reqSpuPicture(
      spu.id as number,
    )
    if (resSpuPicture.code === 200) {
      spuPictureArr.value = resSpuPicture.data.map((item) => {
        return { name: item.imgName, url: item.imgUrl }
      })
    }
    //请求所有品牌
    const resAllTrademark: AllTrademarkResponseData = await reqAllTrademark()
    if (resAllTrademark.code === 200) {
      allTrademark.value = resAllTrademark.data
    }
    //请求基础销售属性
    const resBaseSaleAttr: BaseSaleAttrResponseData = await reqBaseSaleAttr()
    if (resBaseSaleAttr.code === 200) {
      baseSaleAttrArr.value = resBaseSaleAttr.data
    }
  } catch (e) {
    ElMessage.error({
      duration: 2000,
      message: (e as Error).message,
    })
  }
}
//上传照片前回调，用于约束照片格式及大小
const handlePictureBeforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Picture size can not exceed 2MB!')
    return false
  }
  return true
}
//照片墙点击预览按钮回调
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}
//照片墙点击删除按钮回调
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}
//点击添加销售属性按钮回调
const handleAddSaleAttr = () => {
  let [id, name] = unSelectedAttrIdAndAttrName.value.split(':')
  spuSaleAttrArr.value.push({
    baseSaleAttrId: +id,
    saleAttrName: name,
    spuSaleAttrValueList: [],
  })
  //清空之前收集的数据
  unSelectedAttrIdAndAttrName.value = ''
}
//添加属性值按钮点击事件回调
const toEditAttrValue = (saleAttr: SaleAttr) => {
  //添加一个saleAttrValue属性用来保存新增属性值
  saleAttr.saleAttrValue = ''
  //切换为编辑属性值模式
  saleAttr.flag = true
  //输入框自动聚焦
  nextTick(() => {
    inputRef.value.focus()
  })
}
//编辑属性值输入框失去焦点回调
const toUpdateAttrValueList = (saleAttr: SaleAttr) => {
  //切换为展示属性值模式
  saleAttr.flag = false
  //非法情况判断
  //新增属性值为空
  if (saleAttr.saleAttrValue?.trim() === '') {
    ElMessage.error({
      duration: 2000,
      message: "Attr value can't be empty!",
    })
    return
  }
  //属性值重复判断
  const isValueExisted = saleAttr.spuSaleAttrValueList.find(
    (item) => item.saleAttrValueName === saleAttr.saleAttrValue?.trim(),
  )
  if (isValueExisted) {
    ElMessage.error({
      duration: 2000,
      message: 'Attr value has been existed!',
    })
    return
  }
  const { spuId, baseSaleAttrId, saleAttrName, saleAttrValue } = saleAttr
  //将新增的属性值添加到属性值列表
  saleAttr.spuSaleAttrValueList.push({
    spuId: spuId as number,
    baseSaleAttrId,
    saleAttrName,
    saleAttrValueName: saleAttrValue as string,
  })
}
//点击保存SPU数据按钮的回调
const handleSaveSpuData = async () => {
  //整理参数
  //整理照片墙数据
  spuParams.value.spuImageList = spuPictureArr.value.map((item: any) => {
    return {
      imgUrl: (item.response && item.response.data) || item.url,
      imgName: item.name,
    }
  })
  //整理销售属性数据
  spuParams.value.spuSaleAttrList = spuSaleAttrArr.value
  //发送添加或更新请求
  try {
    const res = await reqAddOrUpdateSpu(spuParams.value)
    if (res.code === 200) {
      //发送成功提示
      ElMessage.success({
        duration: 2000,
        message: spuParams.value.id
          ? 'Update SPU Success!'
          : 'Add SPU Success!',
      })
      //切换场景
      $emit('changeScene', {
        scene: 0,
        type: spuParams.value.id ? 'update' : 'add',
      })
    } else {
      throw new Error(
        spuParams.value.id ? 'Update SPU Failed!' : 'Add SPU Failed!',
      )
    }
  } catch (e) {
    //发送失败提示
    ElMessage.error({
      duration: 2000,
      message: (e as Error).message,
    })
  }
}
//点击取消添加或修改SPU按钮回调
const handelCancelAddOrUpdateSPU = () => {
  $emit('changeScene', { scene: 0, type: 'update' })
}
//计算还未选择的销售属性
const unSelectedSaleAttr = computed(() => {
  return baseSaleAttrArr.value.filter((baseItem) => {
    return spuSaleAttrArr.value.every((spuItem) => {
      return spuItem.saleAttrName !== baseItem.name
    })
  })
})
//向外暴露，父组件中通过子组件实例可以访问到
defineExpose({ initUpdateSpuFormData, initAddSpuFormData })
</script>

<style lang="scss" scoped>
.picture-uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);

  &:hover {
    border-color: var(--el-color-primary);
  }

  .picture {
    width: 178px;
    height: 178px;
    display: block;
  }

  .picture-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }
}
</style>

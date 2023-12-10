<template>
  <div>
    <el-card>
      <!--  添加品牌按钮  -->
      <el-button
        icon="Plus"
        type="primary"
        style="width: 130px"
        @click="handleAddTrademark"
      >
        Add Trademark
      </el-button>
      <!--  用于展示的表格组件  -->
      <el-table style="margin: 15px 0" border :data="trademarkList">
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
          <template v-slot="{ row }">
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="handleUpdateTrademark(row)"
              title="Edit Trademark"
            />
            <el-popconfirm
              :title="`Are you sure to delete [${row.tmName}]?`"
              width="250px"
              icon="Delete"
              icon-color="#409EFFFF"
              @confirm="handleDeleteTrademark(row.id)"
            >
              <template #reference>
                <el-button
                  type="danger"
                  size="small"
                  icon="Delete"
                  title="Delete Trademark"
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
        :page-sizes="[3, 6, 9]"
        background
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="getTrademark"
      />
    </el-card>
    <!-- 添加品牌或修改品牌时弹出的对话框 -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="trademarkParams.id ? 'Update Trademark' : 'Add Trademark'"
    >
      <el-form
        label-width="80px"
        style="width: 60%"
        :model="trademarkParams"
        :rules="rules"
        ref="trademarkFormRef"
      >
        <el-form-item label="Trademark:" prop="tmName">
          <el-input
            placeholder="Please input trademark"
            v-model="trademarkParams.tmName"
          />
        </el-form-item>
        <el-form-item label="Logo:" prop="logoUrl">
          <el-upload
            class="logo-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleOnUploadSuccess"
            :before-upload="handleBeforeUpload"
          >
            <img
              v-if="trademarkParams.logoUrl"
              :src="trademarkParams.logoUrl"
              class="logo"
              alt="logo"
            />
            <el-icon v-else class="logo-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!--  具名插槽 footer  -->
      <template #footer>
        <el-button type="warning" @click="handleCancelTrademark">
          Cancel
        </el-button>
        <el-button type="primary" @click="handleConfirmTrademark">
          Confirm
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUpdated, reactive, ref } from 'vue'
import {
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
  reqTrademark,
} from '@/api/product/trademark'
import {
  Records,
  Trademark,
  TrademarkResponseData,
} from '@/api/product/trademark/type'
import { ElMessage, ElNotification } from 'element-plus'
import type { UploadProps } from 'element-plus'
import { InfoFilled } from '@element-plus/icons-vue'
//当前页码
let pageNum = ref<number>(1)
//每页显示条数
let pageSize = ref<number>(3)
//数据总条数
let total = ref<number>(0)
//当前获取到的品牌详细信息
let trademarkList = ref<Records>([])
//控制对话框显示与隐藏
let dialogFormVisible = ref<boolean>(false)
//用于保存添加品牌数据的对象
const trademarkParams = reactive<Trademark>({
  tmName: '',
  logoUrl: '',
})
//自定义logoUrl校验规则
const validateLogoUrl = (rule: any, value: any, callback: any) => {
  console.log(rule)
  if (value) {
    callback()
  } else {
    callback(new Error('Please upload a logo image'))
  }
}
//获取trademark表单实例
let trademarkFormRef = ref()
//定义表单校验规则
const rules = {
  tmName: [
    { required: true, message: 'Please input trademark', trigger: 'change' },
    { min: 2, max: 20, message: 'Length should be 2 to 20', trigger: 'change' },
  ],
  logoUrl: [{ required: true }, { validator: validateLogoUrl }],
}
//获取品牌数据回调
const getTrademark = async (page = 1) => {
  pageNum.value = page
  try {
    const res: TrademarkResponseData = await reqTrademark(
      pageNum.value,
      pageSize.value,
    )
    if (res.code === 200) {
      total.value = res.data.total
      trademarkList.value = res.data.records
    }
  } catch (e) {
    ElMessage.error({
      duration: 2000,
      message: 'Load trademark data error!',
    })
  }
}
//组件挂载完毕后默认请求第1页共3条品牌数据
onMounted(() => {
  getTrademark()
})

//更改每页显示条数回调
const handleSizeChange = () => {
  getTrademark()
}
//添加品牌按钮回调
const handleAddTrademark = () => {
  //显示编辑品牌表单
  dialogFormVisible.value = true
  //清空表单数据
  trademarkParams.id = undefined
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  trademarkFormRef.value?.clearValidate('tmName')
  trademarkFormRef.value?.clearValidate('logoUrl')
}
//修改品牌按钮回调
const handleUpdateTrademark = (row: Trademark) => {
  //显示编辑品牌表单
  dialogFormVisible.value = true
  //数据回显
  Object.assign(trademarkParams, row)
  nextTick(() => {
    //清除表单校验信息
    trademarkFormRef.value.clearValidate('tmName')
    trademarkFormRef.value.clearValidate('logoUrl')
  })
}
//删除品牌按钮回调
const handleDeleteTrademark = async (id: number) => {
  try {
    const res = await reqDeleteTrademark(id)
    if (res.code === 200) {
      await getTrademark(
        trademarkList.value.length > 1 || pageNum.value === 1
          ? pageNum.value
          : pageNum.value - 1,
      )
      ElMessage.success({
        duration: 2000,
        message: 'Delete Success!',
      })
    } else {
      ElMessage.error({
        duration: 2000,
        message: res.data,
      })
    }
  } catch (e) {
    ElMessage.error({
      duration: 2000,
      message: 'Delete Failed!',
    })
  }
}
//点击取消添加/修改品牌回调
const handleCancelTrademark = () => {
  dialogFormVisible.value = false
}
//点击确认添加/修改品牌回调
const handleConfirmTrademark = async () => {
  //发送请求前对所有表单项进行校验，若校验失败则不再执行后续代码
  await trademarkFormRef.value.validate()
  //关闭对话框
  dialogFormVisible.value = false
  try {
    const res = await reqAddOrUpdateTrademark(trademarkParams)
    //添加/修改品牌成功
    if (res.code === 200) {
      //弹出成功提示
      ElMessage.success({
        duration: 2000,
        message: trademarkParams.id ? 'Update Success!' : 'Add Success!',
      })
      //重新请求获取品牌接口
      await getTrademark(trademarkParams.id ? pageNum.value : 1)
    } else {
      ElMessage.error({
        duration: 2000,
        message: res.data,
      })
    }
  } catch (e) {
    //弹出失败提示
    ElMessage.error({
      duration: 2000,
      message: trademarkParams.id ? 'Update Failed!' : 'Add Failed!',
    })
  }
}
//图片上传前回调
const handleBeforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error({
      duration: 2000,
      message: 'Logo image must be JPG/PNG format!',
    })
    return false
  } else if (rawFile.size / 1024 > 300) {
    ElMessage.error({
      duration: 2000,
      message: 'Logo image size can not exceed 300kb!',
    })
    return false
  }
  return true
}
//图片上传成功的回调
const handleOnUploadSuccess: UploadProps['onSuccess'] = (response) => {
  trademarkParams.logoUrl = response.data
  trademarkFormRef.value.clearValidate('logoUrl')
}
</script>

<style lang="scss" scoped>
.logo-uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);

  &:hover {
    border-color: var(--el-color-primary);
  }

  .logo {
    width: 178px;
    height: 178px;
    display: block;
  }

  .logo-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }
}
</style>

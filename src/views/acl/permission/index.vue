<template>
  <div>
    <el-table
      :data="allPermissionCodesData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
    >
      <el-table-column show-overflow-tooltip prop="name" label="Name" />
      <el-table-column
        show-overflow-tooltip
        prop="code"
        label="Permission Value"
      />
      <el-table-column
        show-overflow-tooltip
        prop="updateTime"
        label="Update Time"
      />
      <el-table-column fixed="right" width="300px" label="Operation">
        <template v-slot="{ row }">
          <el-button
            v-if="row.level !== 4"
            type="primary"
            size="small"
            style="width: 80px"
            @click="handleAddPermissionCode(row)"
          >
            {{ row.level === 3 ? 'Add Button' : 'Add Menu' }}
          </el-button>
          <el-button
            v-if="row.level !== 1"
            type="warning"
            size="small"
            title="Edit Permission"
            style="width: 80px"
            @click="handleUpdatePermissionCode(row)"
          >
            {{ 'Edit' }}
          </el-button>
          <el-popconfirm
            v-if="row.level !== 1"
            icon="Delete"
            icon-color="#409EFFFF"
            width="250px"
            :title="`Are you sure to delete '${row.name}'`"
            @confirm="handleDeletePermissionCode(row.id)"
          >
            <template #reference>
              <el-button
                type="danger"
                size="small"
                title="Delete Permission"
                style="width: 80px"
              >
                {{ 'Delete' }}
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="permissionCodeParams.id ? 'Update Permission' : 'Add Permission'"
      v-model="permissionDialogVisible"
    >
      <template #default>
        <el-form
          label-width="120px"
          ref="permissionFormRef"
          :model="permissionCodeParams"
          :rules="rules"
        >
          <el-form-item label="Permission Name:" prop="name">
            <el-input
              v-model="permissionCodeParams.name"
              placeholder="Please input permission name"
            />
          </el-form-item>
          <el-form-item label="Permission Value:" prop="code">
            <el-input
              v-model="permissionCodeParams.code"
              placeholder="Please input permission value"
            />
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button @click="permissionDialogVisible = false">Cancel</el-button>
        <el-button
          type="primary"
          @click="handleConfirmAddOrUpdatePermissionCode"
        >
          Confirm
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  reqAddOrUpdatePermissionCode,
  reqAllPermissionCodes,
  reqDeletePermissionCode,
} from '@/api/acl/permission'
import { ElMessage } from 'element-plus'
import { nextTick, onMounted, reactive, ref } from 'vue'
import {
  PermissionCodeData,
  PermissionCodeParams,
} from '@/api/acl/permission/type'
//保存所有菜单及按钮标识数据
const allPermissionCodesData = ref<PermissionCodeData[]>([])
//控制编辑权限对话框显示与隐藏
const permissionDialogVisible = ref<boolean>(false)
//保存菜单或按钮标识对象参数
const permissionCodeParams = reactive<PermissionCodeParams>({
  id: undefined,
  name: '',
  code: '',
  level: undefined,
  pid: undefined,
})
//用于保存权限表单对象
const permissionFormRef = ref<any>()
//自定义权限标识名称校验规则
const nameValidator = (rule: any, value: string, callback: any) => {
  if (value.trim().length === 0) {
    callback(new Error('permission name is required!'))
  } else {
    callback()
  }
}
//自定义权限标识值校验规则
const valueValidator = (rule: any, value: string, callback: any) => {
  if (value.trim().length === 0) {
    callback(new Error('permission value is required!'))
  } else {
    callback()
  }
}
//用于保存权限表单校验规则
const rules = {
  name: [{ validator: nameValidator, trigger: 'blur' }],
  code: [{ validator: valueValidator, trigger: 'blur' }],
}
//组件一挂载就加载默认数据
onMounted(() => {
  getAllPermissionCodesData()
})
//获取所有菜单和按钮标识回调
const getAllPermissionCodesData = async () => {
  try {
    const res = await reqAllPermissionCodes()
    if (res.code === 200) {
      allPermissionCodesData.value = res.data
    } else {
      throw new Error('Loading Permission Data Error!')
    }
  } catch (e) {
    ElMessage.error({
      duration: 2000,
      message: (e as Error).message,
    })
  }
}
//点击添加菜单或按钮权限标识按钮回调
const handleAddPermissionCode = (row: PermissionCodeData) => {
  //清空旧数据
  Object.assign(permissionCodeParams, {
    id: undefined,
    name: '',
    code: '',
    level: undefined,
    pid: undefined,
  })
  permissionCodeParams.pid = row.id
  permissionCodeParams.level = row.level + 1
  //显示抽屉
  permissionDialogVisible.value = true
  nextTick(() => {
    //清除上次表单校验结果
    permissionFormRef.value.clearValidate()
  })
}
//点击更新菜单或按钮权限标识按钮回调
const handleUpdatePermissionCode = (row: PermissionCodeData) => {
  //数据回显
  Object.assign(permissionCodeParams, row)
  //显示抽屉
  permissionDialogVisible.value = true
  nextTick(() => {
    //清除上次表单校验结果
    permissionFormRef.value.clearValidate()
  })
}
//点击确认添加或更新菜单或按钮权限标识回调
const handleConfirmAddOrUpdatePermissionCode = async () => {
  //校验表单
  await permissionFormRef.value.validate()
  try {
    const res = await reqAddOrUpdatePermissionCode(permissionCodeParams)
    if (res.code === 200) {
      //关闭抽屉
      permissionDialogVisible.value = false
      //重新请求所有菜单和按钮权限标识数据
      await getAllPermissionCodesData()
      ElMessage.success({
        duration: 2000,
        message: permissionCodeParams.id ? 'Update Success!' : 'Add Success!',
      })
    } else {
      throw new Error(
        permissionCodeParams.id ? 'Update Failed!' : 'Add Failed!',
      )
    }
  } catch (e) {
    ElMessage.error({
      duration: 2000,
      message: (e as Error).message,
    })
  }
}
//点击删除菜单后按钮权限标识按钮回调
const handleDeletePermissionCode = async (permissionId: number) => {
  try {
    const res = await reqDeletePermissionCode(permissionId)
    if (res.code === 200) {
      //重新请求所有菜单及按钮权限标识数据
      await getAllPermissionCodesData()
      ElMessage.success({
        duration: 2000,
        message: 'Delete Success!',
      })
    } else {
      throw new Error('Delete Failed!')
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

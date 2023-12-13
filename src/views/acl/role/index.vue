<template>
  <div>
    <el-card style="height: 75px">
      <el-form
        inline
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
        "
      >
        <el-form-item label="Search Role:">
          <el-input
            placeholder="Please input role name"
            v-model="roleKeyword"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearchRoleData">
            Search
          </el-button>
          <el-button
            type="warning"
            @click="settingStore.refresh = !settingStore.refresh"
          >
            Reset
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top: 15px">
      <el-button
        type="primary"
        style="width: 105px"
        icon="Plus"
        @click="handleAddRole"
      >
        Add Role
      </el-button>
      <el-table border style="margin: 15px 0" :data="roleDataArr">
        <el-table-column label="#" align="center" type="index" width="50px" />
        <el-table-column label="Id" width="80px" prop="id" />
        <el-table-column
          label="Role Name"
          prop="roleName"
          show-overflow-tooltip
        />
        <el-table-column
          label="Created Time"
          prop="createTime"
          show-overflow-tooltip
        />
        <el-table-column
          label="Updated Time"
          prop="updateTime"
          show-overflow-tooltip
        />
        <el-table-column
          fixed="right"
          label="Operation"
          width="180px"
          align="center"
        >
          <template v-slot="{ row }">
            <el-button
              type="primary"
              size="small"
              icon="Help"
              title="Assign Permissions"
              @click="handleAssignPermissions(row)"
            />
            <el-button
              type="warning"
              size="small"
              icon="Edit"
              title="Edit Role"
              @click="handleUpdateRole(row)"
            />
            <el-popconfirm
              icon="Delete"
              icon-color="#409EFFFF"
              width="250px"
              :title="`Are you sure to delete '${row.roleName}'`"
              @confirm="handleDeleteRole(row.id)"
            >
              <template #reference>
                <el-button
                  type="danger"
                  size="small"
                  icon="Delete"
                  title="Delete Role"
                />
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!--   分页器   -->
      <el-pagination
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        background
        layout="prev, pager, next, jumper, ->, sizes, total"
        :page-sizes="[2, 10, 20, 30]"
        :total="total"
        @current-change="getRoleDataList"
        @size-change="handleSizeChange"
      />
    </el-card>
    <!--  添加或修改角色对话框-->
    <el-dialog
      v-model="roleDialogVisible"
      :title="roleParams.id ? 'Update Role' : 'Add Role'"
      width="500px"
    >
      <el-form :model="roleParams" ref="roleFormRef" :rules="rules">
        <el-form-item label="Role Name:" prop="roleName">
          <el-input
            v-model="roleParams.roleName"
            autocomplete="off"
            placeholder="Please input role name"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="roleDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleConfirmAddOrUpdateRole">
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!--  分配角色菜单和按钮权限的抽屉 -->
    <el-drawer
      title="Assign Permissions"
      v-model="permissionDrawerVisible"
      direction="rtl"
      size="24%"
    >
      <template #default>
        <!--   树形组件   -->
        <el-tree
          :data="permissionTreeData"
          show-checkbox
          node-key="id"
          default-expand-all
          ref="permissionTreeRef"
          :default-checked-keys="permissionIds"
          :props="{ children: 'children', label: 'name' }"
        />
      </template>
      <template #footer>
        <el-button
          type="warning"
          style="width: 80px"
          @click="permissionDrawerVisible = false"
        >
          Cancel
        </el-button>
        <el-button
          type="primary"
          style="width: 80px"
          @click="handleSavePermissions"
        >
          Confirm
        </el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import {
  reqAddRole,
  reqAssignRolePermissions,
  reqDeleteRole,
  reqRoleDataList,
  reqRoleDateListWithKeyword,
  reqRolePermissions,
  reqUpdateRole,
} from '@/api/acl/role'
import { ElMessage } from 'element-plus'
import { PermissionData, Role } from '@/api/acl/role/type'
import useSettingStore from '@/store/modules/setting'
//当前页
const pageNum = ref<number>(1)
//每页条数
const pageSize = ref<number>(10)
//一共多少条
const total = ref<number>(0)
//保存角色数据
const roleDataArr = ref<Role[]>([])
//使用设置相关的仓库对象
const settingStore = useSettingStore()
//搜索角色关键字
const roleKeyword = ref<string>('')
//用于收集角色数据
const roleParams = ref<Role>({
  id: undefined,
  roleName: '',
  createTime: '',
  updateTime: '',
})
//控制添加或修改角色对话框显示与隐藏
const roleDialogVisible = ref<boolean>(false)
//控制授权抽屉的显示与隐藏
const permissionDrawerVisible = ref<boolean>(false)
//保存权限数据
const permissionTreeData = ref<PermissionData[]>([])
//保存勾选的权限id(仅按钮)
const permissionIds = ref<number[]>([])
//获取权限属性组件
const permissionTreeRef = ref<any>()
//角色表单对象
const roleFormRef = ref<any>()
//自定义角色名称校验规则
const roleNameValidator = (rule: any, value: any, callback: any) => {
  if (value.length < 2) {
    callback(new Error("Role name mustn't less than 2 characters"))
  } else {
    callback()
  }
}
//角色表单校验规则
const rules = {
  roleName: [
    { validator: roleNameValidator, trigger: 'blur' },
    { required: true, trigger: 'blur' },
  ],
}
//组件挂载完毕加载默认数据
onMounted(() => {
  getRoleDataList()
})
//分页获取角色数据
const getRoleDataList = async (page: number = 1) => {
  pageNum.value = page
  try {
    const res = await reqRoleDataList(pageNum.value, pageSize.value)
    if (res.code === 200) {
      total.value = res.data.total
      roleDataArr.value = res.data.records
    } else {
      throw new Error('Loading Data Error')
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
  getRoleDataList()
}
//点击搜索角色按钮回调
const handleSearchRoleData = async () => {
  try {
    const res = await reqRoleDateListWithKeyword(
      pageNum.value,
      pageSize.value,
      roleKeyword.value,
    )
    if (res.code === 200) {
      total.value = res.data.total
      roleDataArr.value = res.data.records
    } else {
      throw new Error('Search Role Error!')
    }
  } catch (e) {
    ElMessage.error({
      duration: 2000,
      message: (e as Error).message,
    })
  }
}
//点击删除角色按钮回调
const handleDeleteRole = async (roleId: number) => {
  try {
    const res = await reqDeleteRole(roleId)
    if (res.code === 200) {
      if (roleDataArr.value.length === 1 && pageNum.value !== 1) {
        await getRoleDataList(pageNum.value - 1)
      } else {
        await getRoleDataList(pageNum.value)
      }
      ElMessage.success('Delete Role Success!')
    } else {
      throw new Error('Delete Role Failed!')
    }
  } catch (e) {
    ElMessage.error({
      duration: 2000,
      message: (e as Error).message,
    })
  }
}
//点击添加角色按钮回调
const handleAddRole = () => {
  //清空旧数据
  Object.assign(roleParams.value, {
    id: undefined,
    roleName: '',
    createTime: '',
    updateTime: '',
  })
  //显示对话框
  roleDialogVisible.value = true
  //清空上次表单校验结果
  nextTick(() => {
    roleFormRef.value.clearValidate('roleName')
  })
}
//点击更新角色按钮回调
const handleUpdateRole = (role: Role) => {
  //数据回显
  Object.assign(roleParams.value, role)
  //显示对话框
  roleDialogVisible.value = true
  //清空上次表单校验结果
  nextTick(() => {
    roleFormRef.value.clearValidate('roleName')
  })
}
//点击确认添加或修改角色按钮回调
const handleConfirmAddOrUpdateRole = async () => {
  await roleFormRef.value.validate()
  try {
    const res = roleParams.value.id
      ? await reqUpdateRole(roleParams.value)
      : await reqAddRole(roleParams.value)
    if (res.code === 200) {
      if (roleParams.value.id) {
        await getRoleDataList(pageNum.value)
      } else {
        await getRoleDataList()
      }
      ElMessage.success({
        duration: 2000,
        message: roleParams.value.id
          ? 'Update Role Success!'
          : 'Add Role Success',
      })
      //隐藏对话框
      roleDialogVisible.value = false
    } else {
      throw new Error(
        roleParams.value.id ? 'Update Role Failed' : 'Add Role Failed',
      )
    }
  } catch (e) {
    //隐藏对话框
    roleDialogVisible.value = false
    ElMessage.error({
      duration: 2000,
      message: (e as Error).message,
    })
  }
}
//点击授权按钮回调
const handleAssignPermissions = async (role: Role) => {
  //保存角色相关信息
  roleParams.value = role
  try {
    //获取权限数据
    const res = await reqRolePermissions(role.id as number)
    if (res.code === 200) {
      //数据回显
      permissionTreeData.value = res.data
      //更新已勾选的权限id（只用考虑按钮级别即可）
      permissionIds.value = []
      getAllCheckedButtonPermissions(
        permissionTreeData.value,
        permissionIds.value,
      )
      //显示抽屉
      permissionDrawerVisible.value = true
    } else {
      throw new Error('Loading Permission Error')
    }
  } catch (e) {
    ElMessage.error({
      duration: 2000,
      message: (e as Error).message,
    })
  }
}
//获取所有已勾选按钮级别权限的id
const getAllCheckedButtonPermissions = (
  permissionArr: PermissionData[],
  ids: number[],
) => {
  permissionArr.forEach((item) => {
    if (item.children.length === 0 && item.select) {
      ids.push(item.id as number)
    }
    if (item.children.length > 0) {
      getAllCheckedButtonPermissions(item.children, ids)
    }
  })
}
//点击保存授权按钮回调
const handleSavePermissions = async () => {
  //获取已勾选id数组
  let idArr = permissionTreeRef.value.getCheckedKeys()
  //获取半选id数组并合并(我感觉这部操作没有意义)
  idArr = idArr.concat(permissionTreeRef.value.getHalfCheckedKeys())
  console.log(idArr)
  try {
    const res = await reqAssignRolePermissions(
      roleParams.value.id as number,
      idArr,
    )
    if (res.code === 200) {
      ElMessage.success({
        duration: 2000,
        message: 'Assign Permissions Success!',
      })
      //隐藏抽屉
      permissionDrawerVisible.value = false
      //刷新网页
      window.location.reload()
    } else {
      //隐藏抽屉
      permissionDrawerVisible.value = false
      throw new Error('Assign Permissions Failed!')
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

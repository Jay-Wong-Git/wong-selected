<template>
  <div>
    <el-card style="height: 75px">
      <el-form
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
        "
      >
        <el-form-item label="Username:">
          <el-input
            placeholder="Please input username"
            v-model="searchKeyword"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearchKeyword">
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
        icon="Plus"
        style="width: 105px"
        @click="handleAddUser"
      >
        Add User
      </el-button>
      <el-button
        :disabled="!userDeleteBatchIds.length > 0"
        icon="Delete"
        type="danger"
        style="width: 105px"
        @click="handleDeleteUserBatch"
      >
        Delete Batch
      </el-button>
      <el-table
        @selection-change="handleUserSelectedChange"
        :data="userDataArr"
        border
        style="margin: 15px 0"
      >
        <el-table-column type="selection" align="center" width="50px" />
        <el-table-column type="index" label="#" align="center" width="50px" />
        <el-table-column label="Id" width="80px" prop="id" />
        <el-table-column
          label="Username"
          show-overflow-tooltip
          prop="username"
        />
        <el-table-column label="Nickname" show-overflow-tooltip prop="name" />
        <el-table-column label="Role" show-overflow-tooltip prop="roleName" />
        <el-table-column
          label="Created Time"
          show-overflow-tooltip
          prop="createTime"
        />
        <el-table-column
          label="Updated Time"
          show-overflow-tooltip
          prop="updateTime"
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
              icon="User"
              title="Assign Role"
              @click="handleAssignRole(row)"
            />
            <el-button
              type="warning"
              size="small"
              icon="Edit"
              title="Edit User"
              @click="handleEditUser(row)"
            />
            <el-popconfirm
              icon="Delete"
              icon-color="#409EFFFF"
              width="250px"
              :title="`Are you sure to delete '${row.username}'`"
              @confirm="handleDeleteUser(row.id)"
            >
              <template #reference>
                <el-button
                  type="danger"
                  size="small"
                  icon="Delete"
                  title="Delete User"
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
        @current-change="getUserDataList"
        @size-change="handleSizeChange"
      />
    </el-card>
    <!--  抽屉用于添加新用户或编辑已有用户数据  -->
    <el-drawer
      :title="userData.id ? 'Update User' : 'Add User'"
      v-model="userDrawerVisible"
      direction="rtl"
      size="24%"
    >
      <template #default>
        <el-form
          label-width="80px"
          ref="userDataRef"
          :rules="rules"
          :model="userData"
        >
          <el-form-item label="Username:" prop="username">
            <el-input v-model="userData.username" style="width: 200px" />
          </el-form-item>
          <el-form-item label="Nickname:" prop="name">
            <el-input v-model="userData.name" style="width: 200px" />
          </el-form-item>
          <el-form-item label="Password:" prop="password" v-if="!userData.id">
            <el-input
              v-model="userData.password"
              type="password"
              style="width: 200px"
              show-password
            />
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button
          type="warning"
          style="width: 80px"
          @click="userDrawerVisible = false"
        >
          Cancel
        </el-button>
        <el-button type="primary" style="width: 80px" @click="handleSaveUser">
          Confirm
        </el-button>
      </template>
    </el-drawer>
    <!--  抽屉用于给用户分配角色  -->
    <el-drawer
      title="Assign Role"
      v-model="roleDrawerVisible"
      size="24%"
      direction="rtl"
    >
      <template #default>
        <el-form label-width="80px">
          <el-form-item label="Username:">
            <el-input v-model="userData.username" disabled />
          </el-form-item>
          <el-form-item label="Role List:">
            <el-checkbox
              v-model="checkAllRoles"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllRolesChange"
            >
              Check all
            </el-checkbox>
            <el-checkbox-group
              v-model="userRoles"
              @change="handleCheckedRolesChange"
            >
              <el-checkbox
                v-for="role in allRoles"
                :key="role.id"
                :label="role"
              >
                {{ role.roleName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button
          type="warning"
          style="width: 80px"
          @click="roleDrawerVisible = false"
        >
          Cancel
        </el-button>
        <el-button
          type="primary"
          style="width: 80px"
          @click="handleSaveUserRole"
        >
          Confirm
        </el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue'
import useSettingStore from '@/store/modules/setting'
import {
  reqAddUserOrUpdateUser,
  reqAssignUserRole,
  reqDeleteUser,
  reqDeleteUserBatch,
  reqUserDataList,
  reqUserDataListWithKeyword,
  reqUserRoleAndAllRole,
} from '@/api/acl/user'
import { ElMessage } from 'element-plus'
import { Role, UserData } from '@/api/acl/user/type'
//使用设置相关的小仓库
const settingStore = useSettingStore()
//搜索关键字
const searchKeyword = ref<string>('')
//当前页
const pageNum = ref<number>(1)
//每页展示多少条
const pageSize = ref<number>(10)
//一共多少页
const total = ref<number>(0)
//记录用户数据
const userDataArr = ref<UserData[]>([])
//控制用户抽屉显示与隐藏
const userDrawerVisible = ref<boolean>(false)
//控制角色抽屉显示与隐藏
const roleDrawerVisible = ref<boolean>(false)
//收集用户信息
const userData = reactive<UserData>({
  id: undefined,
  createTime: '',
  updateTime: '',
  username: '',
  password: '',
  name: '',
  phone: '',
  roleName: '',
})
//用户数据表单引用
const userDataRef = ref<any>()
//是否全选角色
const checkAllRoles = ref<boolean>(false)
//不确定样式
const isIndeterminate = ref<boolean>(true)
//已选角色
const userRoles = ref<Role[]>([])
//所有角色
const allRoles = ref<Role[]>([])
//保存批量删除用户的id
const userDeleteBatchIds = ref<number[]>([])
//自定义校验用户名
const validateUsername = (rule: any, value: any, callback: any) => {
  let regx = /^[a-zA-Z0-9]+$/
  if (regx.test(value)) {
    callback()
  } else {
    callback(new Error('The username can only contain letters and numbers.'))
  }
}
//校验规则
const rules = {
  username: [
    { required: true, message: 'Please input username', trigger: 'blur' },
    { min: 2, max: 20, message: 'Length should be 2 to 20', trigger: 'blur' },
    { validator: validateUsername, trigger: 'blur' },
  ],
  name: [
    { required: true, message: 'Please input username', trigger: 'blur' },
    { min: 2, max: 20, message: 'Length should be 2 to 20', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' },
    { min: 6, max: 20, message: 'Length should be 6 to 20', trigger: 'blur' },
  ],
}

//组件一挂载就立刻加载默认用户数据
onMounted(() => {
  getUserDataList()
})
//加载用户数据
const getUserDataList = async (page: number = 1) => {
  pageNum.value = page
  try {
    const res = await reqUserDataList(pageNum.value, pageSize.value)
    if (res.code == 200) {
      total.value = res.data.total
      userDataArr.value = res.data.records
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
  getUserDataList()
}
//点击搜索用户按钮回调
const handleSearchKeyword = async () => {
  try {
    const res = await reqUserDataListWithKeyword(
      pageNum.value,
      pageSize.value,
      searchKeyword.value,
    )
    if (res.code === 200) {
      userDataArr.value = res.data.records
    } else {
      throw new Error('Search User Error')
    }
  } catch (e) {
    ElMessage.error({
      duration: 2000,
      message: (e as Error).message,
    })
  }
}
//点击添加用户按钮回调
const handleAddUser = () => {
  //清空数据
  Object.assign(userData, {
    id: undefined,
    createTime: '',
    updateTime: '',
    username: '',
    password: '',
    name: '',
    phone: '',
    roleName: '',
  })
  //显示抽屉
  userDrawerVisible.value = true
  //清空上次校验信息
  nextTick(() => {
    userDataRef.value.clearValidate('username')
    userDataRef.value.clearValidate('name')
    userDataRef.value.clearValidate('password')
  })
}
//点击编辑用户按钮回调
const handleEditUser = (user: UserData) => {
  //数据回显
  Object.assign(userData, user)
  //显示抽屉
  userDrawerVisible.value = true
  //清空上次校验信息
  nextTick(() => {
    userDataRef.value.clearValidate('username')
    userDataRef.value.clearValidate('name')
    userDataRef.value.clearValidate('password')
  })
}
//点击保存用户数据按钮回调
const handleSaveUser = async () => {
  //发送请求前统一校验表单
  await userDataRef.value.validate()
  try {
    const res = await reqAddUserOrUpdateUser(userData)
    if (res.code == 200) {
      //收起抽屉
      userDrawerVisible.value = false
      //提示成功
      ElMessage.success({
        duration: 2000,
        message: userData.id ? 'Update User Success!' : 'Add User Success!',
      })
      //重新获取分页用户信息
      await getUserDataList()
      //浏览器刷新
      window.location.reload()
    } else {
      //收起抽屉
      userDrawerVisible.value = false
      throw new Error(userData.id ? 'Update User Failed!' : 'Add User Failed!')
    }
  } catch (e) {
    ElMessage.error({
      duration: 2000,
      message: (e as Error).message,
    })
  }
}
//点击分配角色按钮回调
const handleAssignRole = async (user: UserData) => {
  //清空旧数据
  Object.assign(userData, {
    id: undefined,
    createTime: '',
    updateTime: '',
    username: '',
    password: '',
    name: '',
    phone: '',
    roleName: '',
  })
  //保存用户数据
  Object.assign(userData, user)
  try {
    //获取用户角色及所有角色数据
    const res = await reqUserRoleAndAllRole(user.id as number)
    if (res.code === 200) {
      console.log(res.data)
      userRoles.value = res.data.assignRoles
      allRoles.value = res.data.allRolesList
      //显示角色抽屉
      roleDrawerVisible.value = true
    } else {
      throw new Error('Loading Role Data Error')
    }
  } catch (e) {
    ElMessage.error({
      duration: 2000,
      message: (e as Error).message,
    })
  }
}
//点击保存用户角色回调
const handleSaveUserRole = async () => {
  const roleIdList: number[] = userRoles.value.map((role) => role.id)
  const userId = userData.id as number
  try {
    const res = await reqAssignUserRole({
      roleIdList,
      userId,
    })
    if (res.code === 200) {
      ElMessage.success({
        duration: 2000,
        message: 'Assign Role Success!',
      })
      //关闭抽屉
      roleDrawerVisible.value = false
      //重新获取用户数据
      await getUserDataList(pageNum.value)
    } else {
      throw new Error('Assign Role Failed!')
    }
  } catch (e) {
    ElMessage.error({
      duration: 2000,
      message: (e as Error).message,
    })
  }
}
//切换全选角色回调
const handleCheckAllRolesChange = (val: boolean) => {
  userRoles.value = val ? allRoles.value : []
  isIndeterminate.value = false
}
const handleCheckedRolesChange = (value: string[]) => {
  const checkedCount = value.length
  checkAllRoles.value = checkedCount === allRoles.value.length
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < allRoles.value.length
}
//根据id删除用户回调
const handleDeleteUser = async (userId: number) => {
  try {
    const res = await reqDeleteUser(userId)
    if (res.code === 200) {
      ElMessage.success({
        duration: 2000,
        message: 'Delete User Success!',
      })
      //重新请求用户数据
      if (pageSize.value === 1 && pageNum.value !== 1) {
        await getUserDataList(pageNum.value - 1)
      } else {
        await getUserDataList(pageNum.value)
      }
    } else {
      throw new Error('Delete User Failed!')
    }
  } catch (e) {
    ElMessage.error({
      duration: 2000,
      message: (e as Error).message,
    })
  }
}
//勾选用户发生改变时的回调
const handleUserSelectedChange = (userList: UserData[]) => {
  //更新待删除用户id列表
  userDeleteBatchIds.value = userList.map((user) => user.id as number)
}
//点击批量删除按钮回调
const handleDeleteUserBatch = async () => {
  try {
    const res = await reqDeleteUserBatch(userDeleteBatchIds.value)
    if (res.code === 200) {
      ElMessage.success({
        duration: 2000,
        message: 'Delete User Batch Success!',
      })
      if (
        userDeleteBatchIds.value.length < userDataArr.value.length ||
        pageNum.value === 1
      ) {
        await getUserDataList(pageNum.value)
      } else {
        await getUserDataList(pageNum.value - 1)
      }
    } else {
      throw new Error('Delete User Batch Failed!')
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

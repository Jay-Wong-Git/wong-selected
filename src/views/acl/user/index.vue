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
          <el-input placeholder="Please input username" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary">Search</el-button>
          <el-button type="warning">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top: 15px">
      <el-button type="primary" style="width: 105px" @click="handleAddUser">
        Add User
      </el-button>
      <el-button type="danger" style="width: 105px">Delete Batch</el-button>
      <el-table :data="userDataArr" border style="margin: 15px 0">
        <el-table-column type="selection" align="center" />
        <el-table-column type="index" label="No." align="center" />
        <el-table-column label="Id" width="80px" prop="id" />
        <el-table-column
          label="Username"
          width="120px"
          show-overflow-tooltip
          prop="username"
        />
        <el-table-column
          label="Nickname"
          width="120px"
          show-overflow-tooltip
          prop="name"
        />
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
        <el-table-column label="Operation" width="180px" align="center">
          <template v-slot="{ row }">
            <el-button
              type="primary"
              size="small"
              icon="User"
              title="Assign Role"
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
              :title="`Are you sure to delete '${row}'`"
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
        :page-sizes="[3, 10, 20, 30]"
        :total="total"
        @current-change="getUserDataList"
        @size-change="handleSizeChange"
      />
    </el-card>
    <!--  抽屉用于添加新用户或编辑已有用户数据  -->
    <el-drawer
      :title="userData.id ? 'Update User' : 'Add User'"
      v-model="drawerVisible"
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
          @click="drawerVisible = false"
        >
          Cancel
        </el-button>
        <el-button type="primary" style="width: 80px" @click="handleSaveUser">
          Confirm
        </el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue'
import { reqAddUserOrUpdateUser, reqUserDataList } from '@/api/acl/user'
import { ElMessage, FormRules } from 'element-plus'
import { UserData } from '@/api/acl/user/type'
//当前页
const pageNum = ref<number>(1)
//每页展示多少条
const pageSize = ref<number>(10)
//一共多少页
const total = ref<number>(0)
//记录用户数据
const userDataArr = ref<UserData[]>([])
//控制抽屉显示与隐藏
const drawerVisible = ref<boolean>(false)
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
  drawerVisible.value = true
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
  drawerVisible.value = true
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
      drawerVisible.value = false
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
      drawerVisible.value = false
      throw new Error(userData.id ? 'Update User Failed!' : 'Add User Failed!')
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

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
      <el-button type="primary" style="width: 105px">Add User</el-button>
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
        :page-sizes="[10, 20, 30]"
        :total="total"
        @current-change="getUserDataList"
        @size-change="handleSizeChange"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { reqUserDataList } from '@/api/acl/user'
import { ElMessage } from 'element-plus'
import { UserData } from '@/api/acl/user/type'
//当前页
const pageNum = ref<number>(1)
//每页展示多少条
const pageSize = ref<number>(10)
//一共多少页
const total = ref<number>(0)
//记录用户数据
const userDataArr = ref<UserData[]>([])
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
</script>

<style lang="scss" scoped></style>

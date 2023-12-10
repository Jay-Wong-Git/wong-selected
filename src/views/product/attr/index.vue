<template>
  <div>
    <!--  引入三级分类全局组件  -->
    <Category :scene="scene" />
    <el-card style="margin-top: 15px">
      <!--   显示已有属性场景   -->
      <div v-if="scene === 0">
        <!--   添加属性按钮  -->
        <el-button
          icon="Plus"
          type="primary"
          style="width: 130px"
          :disabled="categoryStore.level3Id === undefined"
          @click="handleAddAttr"
        >
          Add Attr
        </el-button>
        <!--   用于展示属性的表格组件   -->
        <el-table style="margin: 15px 0" border :data="attrArr">
          <el-table-column
            label="No."
            width="80px"
            align="center"
            type="index"
          />
          <el-table-column label="Attr Name" width="150px" prop="attrName" />
          <el-table-column label="Attr Value">
            <template v-slot="{ row }">
              <el-tag
                effect="plain"
                v-for="(item, index) in row.attrValueList"
                style="margin: 5px"
                :key="item.id"
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
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Operation" width="150px">
            <template v-slot="{ row }">
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                @click="handleUpdateAttr(row)"
                title="Edit Attr"
              />
              <el-popconfirm
                :title="`Are you sure to delete [${row.attrName}]?`"
                width="250px"
                icon="Delete"
                icon-color="#409EFFFF"
                @confirm="handleDeleteAttr(row.id)"
              >
                <template #reference>
                  <el-button
                    type="danger"
                    size="small"
                    icon="Delete"
                    title="Delete Attr"
                  />
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--   添加或修改属性场景   -->
      <div v-else>
        <el-form inline>
          <el-form-item label="Attr Name:">
            <el-input
              placeholder="Please input the attr name"
              v-model="attrParams.attrName"
            />
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="Plus"
          :disabled="!attrParams.attrName.trim()"
          @click="handleAddAttrValue"
        >
          Add Attr Value
        </el-button>
        <el-button
          type="warning"
          style="width: 75px"
          @click="handleCancelAddOrUpdateAttr"
        >
          Cancel
        </el-button>
        <el-table
          style="margin: 15px 0"
          border
          :data="attrParams.attrValueList"
        >
          <el-table-column
            label="No."
            width="80px"
            align="center"
            type="index"
          ></el-table-column>
          <el-table-column label="Attr Value">
            <template v-slot="{ row, $index }">
              <el-input
                v-show="row.flag"
                v-model="row.valueName"
                placeholder="Please input attr value"
                @blur="toViewValueMode(row, $index)"
                :ref="(vc: any) => (inputArr[$index] = vc)"
              />
              <div
                class="to-edit-value"
                v-show="!row.flag"
                @click="toEditValueMode(row, $index)"
              >
                {{ row.valueName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column width="150px" label="Operation">
            <template v-slot="{ row, $index }">
              <el-popconfirm
                :title="`Are you sure to delete [${row.valueName}]?`"
                width="250px"
                icon="Delete"
                icon-color="#409EFFFF"
                @confirm="handleDeleteAttrValue($index)"
              >
                <template #reference>
                  <el-button
                    type="danger"
                    size="small"
                    icon="Delete"
                    title="Delete Attr Value"
                  />
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          style="width: 75px"
          @click="handleSaveAttr"
          :disabled="!attrParams.attrValueList.length > 0"
        >
          Save
        </el-button>
        <el-button
          type="warning"
          style="width: 75px"
          @click="handleCancelAddOrUpdateAttr"
        >
          Cancel
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
//引入分类信息相关仓库
import useCategoryStore from '@/store/modules/category'
import { reqAddOrUpdateAttr, reqAttr, reqDeleteAttr } from '@/api/product/attr'
import {
  AttributeResponseData,
  Attribute,
  AttributeValue,
} from '@/api/product/attr/type'
import category from '@/store/modules/category'
import { ElMessage } from 'element-plus'
//使用分类仓库
const categoryStore = useCategoryStore()
//存储已有属性及属性值
let attrArr = ref<Attribute[]>([])
//定义卡片内容切换变量：0表示展示已有属性，1表示添加或修改属性
let scene = ref<number>(0)
//收集新增属性的数据
const attrParams = reactive<Attribute>({
  id: undefined, //属性id
  categoryLevel: 3,
  categoryId: undefined, //三级分类id
  attrName: '', //新增属性名
  attrValueList: [], //新增属性值数组
})
//定义一个存储el-input组件实例的数组
let inputArr = ref<any[]>([])

//组件加载完毕后，若仓库中三级分类有数据，立即发送请求并显示数据
onMounted(() => {
  if (categoryStore.level3Id) {
    getAttr()
  }
})
//组件销毁前，清空掉仓库中分类相关的数据
onBeforeUnmount(() => {
  categoryStore.$reset()
})
//监听仓库三级分类id变化
watch(
  () => categoryStore.level3Id,
  () => {
    attrArr.value = []
    if (!categoryStore.level3Id) return
    getAttr()
  },
)

//获取指定分类下属性及属性值
const getAttr = async () => {
  //获取各级分类id
  const { level1Id, level2Id, level3Id } = categoryStore
  const res: AttributeResponseData = await reqAttr(
    level1Id as number,
    level2Id as number,
    level3Id as number,
  )
  if (res.code === 200) {
    attrArr.value = res.data
  }
}
//点击添加属性按钮回调
const handleAddAttr = () => {
  //清空之前收集的属性数据
  Object.assign(attrParams, {
    id: undefined, //属性id
    categoryLevel: 3,
    categoryId: categoryStore.level3Id, //三级分类id
    attrName: '', //新增属性名
    attrValueList: [], //新增属性值数组
  })
  //切换当前场景为添加或修改属性
  scene.value = 1
}
//点击修改属性按钮回调
const handleUpdateAttr = (row: Attribute) => {
  //切换当前场景为添加或修改属性
  scene.value = 1
  //数据回显
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}
//点击删除属性按钮回调
const handleDeleteAttr = async (attrId: number) => {
  try {
    const res = await reqDeleteAttr(attrId)
    if (res.code === 200) {
      //重新获取所有属性
      await getAttr()
      //提示属性删除成功
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

//点击取消编辑属性按钮回调
const handleCancelAddOrUpdateAttr = () => {
  //切换当前场景为显示已有属性
  scene.value = 0
}
//点击添加属性值按钮回调
const handleAddAttrValue = () => {
  attrParams.attrValueList.push({
    valueName: '',
    flag: true, //标记属性值处于编辑模式还是查看模式：true编辑模式；false查看模式
  })
  //input框自动聚焦
  nextTick(() => {
    inputArr.value[inputArr.value.length - 1].focus()
  })
}
//点击删除指定属性值按钮的回调
const handleDeleteAttrValue = (index: number) => {
  attrParams.attrValueList.splice(index, 1)
}
//点击保存属性按钮的回调
const handleSaveAttr = async () => {
  try {
    //发送请求添加或修改属性
    const res = await reqAddOrUpdateAttr(attrParams)
    if (res.code === 200) {
      //重新请求已有属性数据
      await getAttr()
      //切换场景为展示已有属性
      scene.value = 0
      ElMessage.success({
        duration: 2000,
        message: attrParams.id ? 'Update Success!' : 'Add Success!',
      })
    } else {
      throw new Error(attrParams.id ? 'Update Failed!' : 'Add Failed!')
    }
  } catch (e) {
    ElMessage.error({
      duration: 2000,
      message: (e as Error).message,
    })
  }
}
//切换为查看属性值模式回调
const toViewValueMode = (value: AttributeValue, index: number) => {
  //切换为查看模式前必须保证属性值为非空
  if (value.valueName.trim() === '') {
    //删除掉非法空数据
    attrParams.attrValueList.splice(index, 1)
    ElMessage.error({
      duration: 2000,
      message: "Attribute value can't be empty!",
    })
    return
  }
  //属性值不能重复
  let isRepeated =
    attrParams.attrValueList.filter(
      (item) => item.valueName === value.valueName,
    ).length > 1
  if (isRepeated) {
    //删除掉重复的属性值
    attrParams.attrValueList.splice(index, 1)
    ElMessage.error({
      duration: 2000,
      message: 'Attribute value is existed!',
    })
    return
  }
  value.flag = false
}
//切换为编辑属性值模式回调
const toEditValueMode = (value: AttributeValue, index: number) => {
  value.flag = true
  nextTick(() => {
    //input组件自动聚焦
    inputArr.value[index].focus()
  })
}
</script>

<style lang="scss" scoped>
.to-edit-value {
  &:hover {
    cursor: pointer;
  }
}
</style>

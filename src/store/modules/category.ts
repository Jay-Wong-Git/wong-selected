//分类全局组件小仓库
import { defineStore } from 'pinia'
import { reqLevel1, reqLevel2, reqLevel3 } from '@/api/product/attr'
import { ElMessage } from 'element-plus'
import { CategoryResponseData } from '@/api/product/attr/type'
import { CategoryState } from '@/store/modules/types/type'

export default defineStore('CategoryStore', {
  state(): CategoryState {
    return {
      level1Id: undefined,
      level2Id: undefined,
      level3Id: undefined,
      level1Arr: [],
      level2Arr: [],
      level3Arr: [],
    }
  },
  actions: {
    async getLevel1Data() {
      try {
        const res: CategoryResponseData = await reqLevel1()
        if (res.code === 200) {
          this.level1Arr = res.data
        } else {
          throw new Error(res.message)
        }
      } catch (e) {
        ElMessage.error({
          duration: 2000,
          message: (e as Error).message,
        })
      }
    },
    async getLevel2Data(id: number) {
      try {
        const res: CategoryResponseData = await reqLevel2(id)
        if (res.code === 200) {
          this.level2Arr = res.data
        } else {
          throw new Error(res.message)
        }
      } catch (e) {
        ElMessage.error({
          duration: 2000,
          message: (e as Error).message,
        })
      }
    },
    async getLevel3Data(id: number) {
      try {
        const res: CategoryResponseData = await reqLevel3(id)
        if (res.code === 200) {
          this.level3Arr = res.data
        } else {
          throw new Error(res.message)
        }
      } catch (e) {
        ElMessage.error({
          duration: 2000,
          message: (e as Error).message,
        })
      }
    },
  },
})

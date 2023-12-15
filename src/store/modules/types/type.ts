//定义小仓库中state的ts类型
import type { RouteRecordRaw } from 'vue-router'
import type { CategoryDetail } from '@/api/product/attr/type'

export interface UserState {
  token: string | null
  userRoutes: RouteRecordRaw[]
  username: string
  avatar: string
}

export interface CategoryState {
  level1Id: number | undefined
  level2Id: number | undefined
  level3Id: number | undefined
  level1Arr: CategoryDetail[]
  level2Arr: CategoryDetail[]
  level3Arr: CategoryDetail[]
}

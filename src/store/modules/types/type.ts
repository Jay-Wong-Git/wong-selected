//定义小仓库中state的ts类型
import { RouteRecordRaw } from 'vue-router'
import { constRoutes } from '@/router/routes'

export interface UserState {
  token: string | null
  constRoutes: RouteRecordRaw[]
  username: string
  avatar: string
}

//角色管理接口相关ts类型
//基本返回ts类型
interface ResponseData {
  code: number
  message: string
  ok: boolean
}
//角色ts类型
export interface Role {
  id?: number
  roleName: string
  createTime?: string
  updateTime?: string
}

//分页获取角色的返回数据ts类型
export interface RoleDataListResponseData extends ResponseData {
  data: {
    records: Role[]
    total: number
    size: number
    current: number
    pages: number
  }
}
//菜单权限与按钮权限的ts类型
export interface PermissionData {
  id?: number
  createTime: string
  updateTime: string
  pid?: number
  name: string
  code: string
  toCode: string
  type: number
  level: number
  children: PermissionData[]
  select: boolean
}
//获取权限接口的返回数据ts类型
export interface PermissionTreeResponseData extends ResponseData {
  data: PermissionData[]
}

//菜单管理接口相关ts类型
//基本返回ts类型
interface ResponseData {
  code: number
  message: string
  ok: boolean
}

//菜单或按钮标识数据ts类型
export interface PermissionCodeData {
  id?: number
  createTime: string
  updateTime: string
  pid: number
  name: string
  code: string
  toCode: string
  type: number
  level: number
  children: PermissionCodeData[]
}
//获取所有菜单和按钮标识数据返回值的ts类型
export interface PermissionCodesResponseData extends ResponseData {
  data: PermissionCodeData[]
}

//添加或更新菜单或按钮标识接口参数ts类型‘
export interface PermissionCodeParams {
  id?: number
  name: string
  code: string
  level: number | undefined
  pid: number | undefined
}

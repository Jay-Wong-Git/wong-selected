//定义用户相关的ts类型
//定义所有接口返回数据的ts类型继承的基本ts类型
interface ResponseData {
  code: number
  message: string
  ok: boolean
}
//定义用户数据ts类型
export interface UserData {
  id?: number | undefined
  createTime?: string
  updateTime?: string
  username: string
  password: string
  name: string
  phone?: string
  roleName?: string
}
//定义分页获取用户数据返回值ts类型
export interface UserDataListResponseData extends ResponseData {
  data: {
    records: UserData[]
    total: number
    size: number
    current: number
    pages: number
  }
}
//定义角色ts类型
export interface Role {
  id: number
  roleName: string
}
//定义获取所有角色及用户所拥有角色接口返回数据类型
export interface UserRoleAndAllRoleResponseData extends ResponseData {
  data: {
    assignRoles: Role[]
    allRolesList: Role[]
  }
}

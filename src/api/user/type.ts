//定义用户相关ts数据类型
//定义用户登录接口参数ts类型
export interface loginFormData {
  username: string
  password: string
}
//定义所有接口返回数据的ts类型继承的基本ts类型
export interface responseData {
  code: number
  message: string
  ok: boolean
}
//定义登录接口返回数据的ts类型
export interface loginResponseData extends responseData {
  data: string
}
//定义获取用户信息接口返回数据的ts类型
export interface userInfoResponseData extends responseData {
  data: {
    routes: string[]
    buttons: string[]
    roles: string[]
    name: string
    avatar: string
  }
}
//region mock相关
/*//登录接口需要携带的参数的ts类型
export interface loginForm {
  username: string
  password: string
}
//登录接口返回数据的ts类型
interface loginResDataType {
  token?: string
  message?: string
}
export interface loginResponseData {
  code: number
  data: loginResDataType
}
//用户信息接口返回数据的ts类型
interface userInfoDataType {
  userId: number
  avatar: string
  username: string
  password: string
  desc: string
  roles: string[]
  buttons: string[]
  routes: string[]
  token: string
}
interface userInfoResDataType {
  checkUser: userInfoDataType
  message?: string
}
export interface userInfoResponseData {
  code: number
  data: userInfoResDataType
}*/
//endregion

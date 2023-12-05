//登录接口需要携带的参数的ts类型
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
}
export interface userInfoResponseData {
  code: number
  data: userInfoResDataType
}

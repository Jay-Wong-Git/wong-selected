import request from '@/utils/request'
import {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
} from '@/api/user/type'
//用户相关的请求接口
enum API {
  LOGIN_URL = '/admin/acl/index/login',
  USERINFO_URL = '/admin/acl/index/info',
  LOGOUT_URL = '/admin/acl/index/logout',
}

//登录接口
export const reqLogin = (data: loginFormData) =>
  request.post<any, loginResponseData>(API.LOGIN_URL, data)
//获取用户信息接口
export const reqUserInfo = () =>
  request.get<any, userInfoResponseData>(API.USERINFO_URL)

//退出登录接口
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)
//region mock相关
/*//统一管理用户相关的接口
import request from '@/utils/request'
import {
  loginForm,
  loginResponseData,
  userInfoResponseData,
} from '@/api/user/type'

enum API {
  LOGIN_URL = 'user/login',
  USERINFO_URL = 'user/info',
}
//向外暴露请求函数
//登录接口
export const reqLogin = (data: loginForm) =>
  request.post<any, loginResponseData>(API.LOGIN_URL, data)
//获取用户信息接口
export const reqUserInfo = () =>
  request.get<any, userInfoResponseData>(API.USERINFO_URL)*/
//endregion

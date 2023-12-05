//统一管理用户相关的接口
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
  request.get<any, userInfoResponseData>(API.USERINFO_URL)

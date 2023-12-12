//用户相关的请求接口
import request from '@/utils/request'
import { UserData, UserDataListResponseData } from '@/api/acl/user/type'
enum API {
  //分页获取用户数据接口地址
  USER_DATA_LIST_URL = '/admin/acl/user',
  //添加新用户的接口地址
  ADD_USER_URL = '/admin/acl/user/save',
  //更新用户数据的接口地址
  UPDATE_USER_URL = '/admin/acl/user/update',
}
//分页获取用户数据接口
export const reqUserDataList = (pageNum: number, pageSize: number) =>
  request.get<any, UserDataListResponseData>(
    `${API.USER_DATA_LIST_URL}/${pageNum}/${pageSize}`,
  )
//添加新用户或更新用户数据的接口
export const reqAddUserOrUpdateUser = (userData: UserData) => {
  if (userData.id) {
    //更新用户数据
    return request.put<any, any>(API.UPDATE_USER_URL, userData)
  } else {
    //添加新用户
    return request.post<any, any>(API.ADD_USER_URL, userData)
  }
}

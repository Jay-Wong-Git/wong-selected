//用户相关的请求接口
import request from '@/utils/request'
import {
  UserData,
  UserDataListResponseData,
  UserRoleAndAllRoleResponseData,
} from '@/api/acl/user/type'
enum API {
  //分页获取用户数据接口地址
  USER_DATA_LIST_URL = '/admin/acl/user',
  //添加新用户的接口地址
  ADD_USER_URL = '/admin/acl/user/save',
  //更新用户数据的接口地址
  UPDATE_USER_URL = '/admin/acl/user/update',
  //获取全部角色及当前用户所拥有角色的接口地址
  USER_ROLE_AND_ALL_ROLE_URL = '/admin/acl/user/toAssign',
  //给用户分配角色接口地址
  ASSIGN_USER_ROLE_URL = '/admin/acl/user/doAssignRole',
  //根据ID删除用户接口地址
  DELETE_USER_URL = '/admin/acl/user/remove',
  //批量删除用户接口地址
  DELETE_USER_BATCH_URL = '/admin/acl/user/batchRemove',
}
//分页获取用户数据接口
export const reqUserDataList = (pageNum: number, pageSize: number) =>
  request.get<any, UserDataListResponseData>(
    `${API.USER_DATA_LIST_URL}/${pageNum}/${pageSize}`,
  )
//分页获取用户数据接口(带搜索关键字)
export const reqUserDataListWithKeyword = (
  pageNum: number,
  pageSize: number,
  keyword: string,
) =>
  request.get<any, UserDataListResponseData>(
    `${API.USER_DATA_LIST_URL}/${pageNum}/${pageSize}?username=${keyword}`,
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
//获取全部角色及当前用户所拥有角色的接口
export const reqUserRoleAndAllRole = (userId: number) =>
  request.get<any, UserRoleAndAllRoleResponseData>(
    `${API.USER_ROLE_AND_ALL_ROLE_URL}/${userId}`,
  )
//给用户分配角色接口
export const reqAssignUserRole = (data: {
  roleIdList: number[]
  userId: number
}) => request.post<any, any>(API.ASSIGN_USER_ROLE_URL, data)
//根据ID删除用户接口
export const reqDeleteUser = (userId: number) =>
  request.delete<any, any>(`${API.DELETE_USER_URL}/${userId}`)
//批量删除用户接口
export const reqDeleteUserBatch = (data: number[]) =>
  request.delete<any, any>(API.DELETE_USER_BATCH_URL, { data })

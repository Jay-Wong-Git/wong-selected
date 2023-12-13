//角色管理接口及地址
import request from '@/utils/request'
import {
  PermissionTreeResponseData,
  Role,
  RoleDataListResponseData,
} from '@/api/acl/role/type'

enum API {
  //分页获取角色接口地址
  ROLE_DATA_LIST_URL = '/admin/acl/role',
  //删除指定角色接口地址
  DELETE_ROLE_URL = '/admin/acl/role/remove',
  //添加角色接口地址
  ADD_ROLE_URL = '/admin/acl/role/save',
  //更新角色接口地址
  UPDATE_ROLE_URL = '/admin/acl/role/update',
  //获取指定角色的所有权限信息接口地址
  ROLE_PERMISSIONS_URL = '/admin/acl/permission/toAssign',
  //给指定角色授权接口地址
  ASSIGN_ROLE_PERMISSIONS_URL = '/admin/acl/permission/doAssign',
}

//分页获取角色接口
export const reqRoleDataList = (pageNum: number, pageSize: number) =>
  request.get<any, RoleDataListResponseData>(
    `${API.ROLE_DATA_LIST_URL}/${pageNum}/${pageSize}`,
  )
//分页获取搜索角色接口
export const reqRoleDateListWithKeyword = (
  pageNum: number,
  pageSize: number,
  keyword: string,
) =>
  request.get<any, RoleDataListResponseData>(
    `${API.ROLE_DATA_LIST_URL}/${pageNum}/${pageSize}?roleName=${keyword}`,
  )
//删除指定角色接口
export const reqDeleteRole = (roleId: number) =>
  request.delete<any, any>(`${API.DELETE_ROLE_URL}/${roleId}`)
//添加角色接口
export const reqAddRole = (roleData: Role) =>
  request.post<any, any>(`${API.ADD_ROLE_URL}`, roleData)
//更新角色接口
export const reqUpdateRole = (roleData: Role) =>
  request.put<any, any>(`${API.UPDATE_ROLE_URL}`, roleData)
//获取指定角色权限信息的接口
export const reqRolePermissions = (roleId: number) =>
  request.get<any, PermissionTreeResponseData>(
    `${API.ROLE_PERMISSIONS_URL}/${roleId}`,
  )
//给指定角色授权接口
export const reqAssignRolePermissions = (
  roleId: number,
  permissionId: number[],
) =>
  request.post<any, any>(
    `${API.ASSIGN_ROLE_PERMISSIONS_URL}?roleId=${roleId}&permissionId=${permissionId}`,
  )

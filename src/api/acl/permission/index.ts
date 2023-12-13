//菜单管理相关接口
import request from '@/utils/request'
import {
  PermissionCodeParams,
  PermissionCodesResponseData,
} from '@/api/acl/permission/type'

enum API {
  //获取所有菜单及按钮标识接口地址
  ALL_PERMISSION_CODES_URL = '/admin/acl/permission',
  //添加菜单或按钮标识接口地址
  ADD_PERMISSION_CODE_URL = '/admin/acl/permission/save',
  //更新菜单或按钮标识接口地址
  UPDATE_PERMISSION_CODE_URL = '/admin/acl/permission/update',
  //删除菜单或按钮标识接口地址
  DELETE_PERMISSION_CODE_URL = '/admin/acl/permission/remove',
}

//获取所有菜单及按钮标识接口
export const reqAllPermissionCodes = () =>
  request.get<any, PermissionCodesResponseData>(API.ALL_PERMISSION_CODES_URL)
//添加或更新菜单或按钮标识接口
export const reqAddOrUpdatePermissionCode = (data: PermissionCodeParams) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATE_PERMISSION_CODE_URL, data)
  } else {
    return request.post<any, any>(API.ADD_PERMISSION_CODE_URL, data)
  }
}
//删除菜单或按钮权限标识接口
export const reqDeletePermissionCode = (permissionId: number) =>
  request.delete<any, any>(`${API.DELETE_PERMISSION_CODE_URL}/${permissionId}`)

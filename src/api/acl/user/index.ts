//用户相关的请求接口
import request from '@/utils/request'
import { UserDataListResponseData } from '@/api/acl/user/type'
enum API {
  //分页获取用户数据接口地址
  USER_DATA_LIST_URL = '/admin/acl/user',
}
//分页获取用户数据接口
export const reqUserDataList = (pageNum: number, pageSize: number) =>
  request.get<any, UserDataListResponseData>(
    `${API.USER_DATA_LIST_URL}/${pageNum}/${pageSize}`,
  )

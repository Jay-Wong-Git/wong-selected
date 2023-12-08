//品牌相关的请求接口
import request from '@/utils/request'
import { Trademark, TrademarkResponseData } from '@/api/product/trademark/type'
enum API {
  //获取已有品牌接口地址
  TRADEMARK_URL = '/admin/product/baseTrademark',
  //添加一个品牌接口地址
  ADD_TRADEMARK_URL = '/admin/product/baseTrademark/save',
  //修改一个品牌接口地址
  UPDATE_TRADEMARK_URL = '/admin/product/baseTrademark/update',
  //删除一个品牌接口地址
  DELETE_TRADEMARK_URL = '/admin/product/baseTrademark/remove',
}
//获取已有品牌接口
export const reqTrademark = (page: number, limit: number) =>
  request.get<any, TrademarkResponseData>(
    `${API.TRADEMARK_URL}/${page}/${limit}`,
  )
//添加或修改品牌接口
export const reqAddOrUpdateTrademark = (data: Trademark) => {
  //有id属性，则修改品牌
  if (data.id) {
    return request.put<any, any>(API.UPDATE_TRADEMARK_URL, data)
  } else {
    //没有id属性，则添加品牌
    return request.post<any, any>(API.ADD_TRADEMARK_URL, data)
  }
}
//删除品牌接口
export const reqDeleteTrademark = (id: number) =>
  request.delete<any, any>(`${API.DELETE_TRADEMARK_URL}/${id}`)

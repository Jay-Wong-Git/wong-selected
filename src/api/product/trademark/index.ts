//品牌相关的请求接口
import request from '@/utils/request'
import { TrademarkResponseData } from '@/api/product/trademark/type'
enum API {
  TRADEMARK_URL = '/admin/product/baseTrademark',
}
//获取已有品牌接口
export const reqTrademark = (page: number, limit: number) =>
  request.get<any, TrademarkResponseData>(
    `${API.TRADEMARK_URL}/${page}/${limit}`,
  )

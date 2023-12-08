//定义品牌相关接口数据ts类型
//定义品牌相关接口基础的返回数据的ts类型
interface ResponseData {
  code: number
  message: string
  ok: boolean
}
//某个品牌详细信息的ts类型
export interface Trademark {
  id?: number
  tmName: string
  logoUrl: string
}
//请求返回的所有品牌数组的ts类型
export type Records = Trademark[]
//定义获取品牌接口返回数据的ts类型
export interface TrademarkResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

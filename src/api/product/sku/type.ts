//获取SKU相关接口用到的ts类型

interface ResponseData {
  code: number
  message: string
  ok: boolean
}
//定义SKU对象的ts类型
export interface SkuData {
  id?: number
  skuName: string
  skuDesc: string
  weight: number | undefined
  price: number | undefined
  isSale?: 0 | 1 //0表示下架，1表示上架
  skuAttrValueList: { attrId: number; valueId: number }[]
  skuDefaultImg: string
  skuSaleAttrValueList: { saleAttrId: number; saleAttrValueId: number }[]
  category3Id: number | undefined
  spuId: number | undefined
  tmId: number | undefined
}
//定义返回记录的ts类型
type Records = SkuData[]
//定义获取已有SKU返回数据的ts类型
export interface SkuResponseData extends ResponseData {
  data: {
    records: Records
    total: number //一共多少条记录
    size: number //每页几条记录
    current: number //当前第几页
    pages: number //一共多少页
  }
}

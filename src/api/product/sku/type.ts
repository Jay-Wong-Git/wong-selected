//获取SKU相关接口用到的ts类型

interface ResponseData {
  code: number
  message: string
  ok: boolean
}
//AttrValue
export interface AttrValue {
  id?: number
  attrId: number
  valueId: number
  skuId?: number
  attrName?: string
  valueName?: string
}
//SaleAttrValue
export interface SaleAttrValue {
  id?: number
  skuId?: number
  spuId?: number
  saleAttrValueId: number
  saleAttrId: number
  saleAttrName?: string
  saleAttrValueName?: string
}
//SkuImage
export interface SkuImage {
  id?: number
  skuId?: number
  imgName?: string
  imgUrl: string
  spuImgId?: number
  isDefault?: number
}
//定义SKU对象的ts类型
export interface SkuData {
  id?: number
  skuName: string
  skuDesc: string
  weight: number | undefined
  price: number | undefined
  isSale?: 0 | 1 //0表示下架，1表示上架
  skuAttrValueList: AttrValue[]
  skuDefaultImg: string
  skuImageList?: SkuImage[]
  skuSaleAttrValueList: SaleAttrValue[]
  category3Id: number | undefined
  spuId: number | undefined
  tmId: number | undefined
}
//定义返回记录的ts类型
type Records = SkuData[]
//定义获取已有SKU返回数据的ts类型
export interface AllSkuResponseData extends ResponseData {
  data: {
    records: Records
    total: number //一共多少条记录
    size: number //每页几条记录
    current: number //当前第几页
    pages: number //一共多少页
  }
}
//定义获取指定SKU返回数据的ts类型
export interface SkuResponseData extends ResponseData {
  data: SkuData
}

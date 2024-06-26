//spu相关ts类型
//定义返回数据的基本ts类型
import { Attribute } from '@/api/product/attr/type'

interface ResponseData {
  code: number
  message: string
  ok: boolean
}
//定义SPU对象的ts类型
export interface SpuData {
  id?: number
  spuName: string
  tmId: number | undefined
  description: string
  spuImageList: null | SpuPicture[]
  spuSaleAttrList: null | SaleAttr[]
  category3Id: number | undefined
}
//定义返回记录的ts类型
type Records = SpuData[]
//定义获取已有SPU返回数据的ts类型
export interface SpuResponseData extends ResponseData {
  data: {
    records: Records
    total: number //一共多少条记录
    size: number //每页几条记录
    current: number //当前第几页
    pages: number //一共多少页
    searchCount: boolean
  }
}
//定义品牌数据的ts类型
export interface Trademark {
  id?: number
  tmName: string
  logoUrl: string
}
//定义获取全部品牌接口返回数据的ts类型
export interface AllTrademarkResponseData extends ResponseData {
  data: Trademark[]
}
//定义SPU相关单张图片信息的ts数据类型
export interface SpuPicture {
  id?: number
  spuId?: number
  imgName?: string
  imgUrl?: string
  name?: string
  url?: string
}
//定义获取SPU相关图片接口返回数据ts类型
export interface SpuPictureResponseData extends ResponseData {
  data: SpuPicture[]
}
//定义销售属性值ts类型
export interface SaleAttrValue {
  id?: number
  baseSaleAttrId: number
  saleAttrName: string
  saleAttrValueName: string
  spuId: number
}
//定义销售属性对象ts类型
export interface SaleAttr {
  id?: number
  baseSaleAttrId: number
  saleAttrName: string
  spuSaleAttrValueList: SaleAttrValue[]
  spuId?: number
  flag?: boolean //true表示编辑，false表示展示
  saleAttrValue?: string // 用来临时记录新增属性值
  saleAttrIdAndValueId?: string //临时记录属性id及所选属性值id
}

//定义获取指定SPU销售属性返回对象的ts类型
export interface SpuSaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}

//定义基础销售属性ts类型
export interface BaseSaleAttr {
  id: number
  name: string
}
//定义获取基础销售属性接口返回值ts类型
export interface BaseSaleAttrResponseData extends ResponseData {
  data: BaseSaleAttr[]
}
//定义SKU的ts类型
export interface SkuData {
  id?: number
  skuName: string
  skuDesc: string
  weight: number | undefined
  price: number | undefined
  skuAttrValueList: { attrId: number; valueId: number }[]
  skuDefaultImg: string
  skuImageList?: string[]
  skuSaleAttrValueList: { saleAttrId: number; saleAttrValueId: number }[]
  category3Id: number | undefined
  spuId: number | undefined
  tmId: number | undefined
}
//定义获取指定SPU下所有SKU返回数据的ts类型
export interface SpuAllSkuResponseData extends ResponseData {
  data: SkuData[]
}

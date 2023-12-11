//SPU管理模块相关接口
import request from '@/utils/request'
import {
  AllTrademarkResponseData,
  BaseSaleAttrResponseData,
  SkuData,
  SpuData,
  SpuPictureResponseData,
  SpuResponseData,
  SpuSaleAttrResponseData,
} from '@/api/product/spu/type'

enum API {
  //获取已有的SPU的数据接口地址
  SPU_URL = '/admin/product',
  //获取所有品牌接口地址
  ALL_TRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  //获取指定SPU的所有图片接口地址
  SPU_PICTURE_URL = '/admin/product/spuImageList',
  //获取指定SPU所有销售属性接口地址
  SPU_SALE_ATTR_URL = '/admin/product/spuSaleAttrList',
  //获取基础销售属性接口地址
  BASE_SALE_ATTR_URL = '/admin/product/baseSaleAttrList',
  //添加SPU接口地址
  ADD_SPU_URL = '/admin/product/saveSpuInfo',
  //修改SPU接口地址
  UPDATE_SPU_URL = '/admin/product/updateSpuInfo',
  //删除SPU接口地址
  DELETE_SPU_URL = '/admin/product/deleteSpu/{spuId}',
  //添加SKU接口地址
  ADD_SKU_URL = '/admin/product/saveSkuInfo',
}

//获取已有的SPU数据接口
export const reqSPU = (pageNum: number, pageSize: number, level3Id: number) =>
  request.get<any, SpuResponseData>(
    `${API.SPU_URL}/${pageNum}/${pageSize}?category3Id=${level3Id}`,
  )
//获取所有品牌接口
export const reqAllTrademark = () =>
  request.get<any, AllTrademarkResponseData>(API.ALL_TRADEMARK_URL)
//获取指定SPU的所有图片接口
export const reqSpuPicture = (spuId: number) =>
  request.get<any, SpuPictureResponseData>(`${API.SPU_PICTURE_URL}/${spuId}`)
//获取指定SPU所有销售属性接口
export const reqSpuSaleAttr = (spuId: number) =>
  request.get<any, SpuSaleAttrResponseData>(`${API.SPU_SALE_ATTR_URL}/${spuId}`)
//获取基础销售属性接口
export const reqBaseSaleAttr = () =>
  request.get<any, BaseSaleAttrResponseData>(API.BASE_SALE_ATTR_URL)
//添加或更新SPU接口
export const reqAddOrUpdateSPU = (data: SpuData) => {
  if (!data.id) {
    return request.post<any, any>(API.ADD_SPU_URL, data)
  } else {
    return request.post<any, any>(API.UPDATE_SPU_URL, data)
  }
}
//添加SKU接口
export const reqAddSKU = (data: SkuData) =>
  request.post<any, any>(API.ADD_SKU_URL, data)

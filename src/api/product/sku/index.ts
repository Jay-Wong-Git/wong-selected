//SKU管理模块相关接口
import request from '@/utils/request'
import { AllSkuResponseData, SkuResponseData } from '@/api/product/sku/type'

enum API {
  //获取已有SKU的接口地址
  ALL_SKU_URL = '/admin/product/list',
  //删除SKU的接口地址
  DELETE_SKU_URL = '/admin/product/deleteSku',
  //SKU上架接口地址
  SKU_ON_SALE_URL = '/admin/product/onSale',
  //SKU下架接口地址
  SKU_CANCEL_SALE_URL = '/admin/product/cancelSale',
  //获取指定SKU的接口地址
  SKU_URL = '/admin/product/getSkuInfo',
}

//获取已有SKU的接口
export const reqAllSku = (pageNum: number, pageSize: number) =>
  request.get<any, AllSkuResponseData>(
    `${API.ALL_SKU_URL}/${pageNum}/${pageSize}`,
  )
//删除指定SKU的接口
export const reqDeleteSku = (skuId: number) =>
  request.delete<any, any>(`${API.DELETE_SKU_URL}/${skuId}`)
//SKU上架接口
export const reqSkuOnSale = (skuId: number) =>
  request.get<any, any>(`${API.SKU_ON_SALE_URL}/${skuId}`)
//SKU下架接口
export const reqSkuCancelSale = (skuId: number) =>
  request.get<any, any>(`${API.SKU_CANCEL_SALE_URL}/${skuId}`)
//获取指定SKU的接口
export const reqSku = (skuId: number) =>
  request.get<any, SkuResponseData>(`${API.SKU_URL}/${skuId}`)

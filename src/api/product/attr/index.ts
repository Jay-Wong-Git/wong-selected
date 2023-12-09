//属性相关的请求接口
import request from '@/utils/request'
import type {
  Attribute,
  AttributeResponseData,
  CategoryResponseData,
} from '@/api/product/attr/type'
enum API {
  //获取属性一级分类的接口地址
  LEVEL_1_URL = '/admin/product/getCategory1',
  //获取属性二级分类的接口地址
  LEVEL_2_URL = '/admin/product/getCategory2',
  //获取属性三级分类的接口地址
  LEVEL_3_URL = '/admin/product/getCategory3',
  //获取指定分类下属性及属性值的接口地址
  ATTR_URL = '/admin/product/attrInfoList/',
  //添加属性或修改已有属性值的接口地址
  ADD_OR_UPDATE_ADDR_URL = '/admin/product/saveAttrInfo',
}
//获取属性一级分类的接口
export const reqLevel1 = () =>
  request.get<any, CategoryResponseData>(API.LEVEL_1_URL)
//获取属性二级分类的接口
export const reqLevel2 = (id: number) =>
  request.get<any, CategoryResponseData>(`${API.LEVEL_2_URL}/${id}`)
//获取属性三级分类的接口
export const reqLevel3 = (id: number) =>
  request.get<any, CategoryResponseData>(`${API.LEVEL_3_URL}/${id}`)
//获取指定分类下属性及属性值接口
export const reqAttr = (level1Id: number, level2Id: number, level3Id: number) =>
  request.get<any, AttributeResponseData>(
    `${API.ATTR_URL}/${level1Id}/${level2Id}/${level3Id}`,
  )
//添加属性或修改已有属性值的接口
export const reqAddOrUpdateAttr = (data: Attribute) =>
  request.post<any, any>(API.ADD_OR_UPDATE_ADDR_URL, data)

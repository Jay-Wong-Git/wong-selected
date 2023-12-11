//定义属性相关接口数据的ts类型
//定义基本返回数据ts类型
interface ResponseData {
  code: number
  message: string
  ok: boolean
}

//定义单个分类详细信息的ts类型
export interface CategoryDetail {
  id?: number
  name: string
  category1Id?: number
  category2Id?: number
}

//定义分类返回数据ts类型
export interface CategoryResponseData extends ResponseData {
  data: CategoryDetail[]
}

//定义单个属性值ts类型
export interface AttributeValue {
  id?: number
  attrId?: number
  valueName: string
  flag?: boolean //标记当前属性值处于查看模式还是编辑模式，true编辑，false查看
}

//定义存储多个属性值的数组的ts类型
export type AttributeValueList = AttributeValue[]

//定义属性对象
export interface Attribute {
  id?: number | undefined
  categoryLevel: number
  categoryId: number | undefined
  attrName: string
  attrValueList: AttributeValueList
  attrIdAndValueId?: string //临时记录属性id及所选属性值id
}

//定义获取属性及属性值接口返回数据ts类型
export interface AttributeResponseData extends ResponseData {
  data: Attribute[]
}

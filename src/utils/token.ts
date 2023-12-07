//封装存储与读取本地数据的方法
//存储token
export const SET_TOKEN = (token: string) => {
  localStorage.setItem('TOKEN', token)
}
//读取token
export const GET_TOKEN = () => {
  return localStorage.getItem('TOKEN')
}
//删除token
export const REMOVE_TOKEN = () => {
  localStorage.removeItem('TOKEN')
}

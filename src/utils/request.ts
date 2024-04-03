//进行axios二次封装:使用请求与响应拦截器
import axios from 'axios'
import { ElMessage } from 'element-plus'
//引入用户信息相关的仓库
import useUserStore from '@/store/modules/user'
//利用axios对象的create方法创建axios实例(可以配置基础路径、超时时间等)
const request = axios.create({
  //基础路径
  baseURL: import.meta.env.VITE_APP_BASE_API, //基础路径上会携带/api
  timeout: 5000, //配置请求超时时间为5s
})

//添加请求拦截器
request.interceptors.request.use((config) => {
  //获取用户信息相关的仓库，将token信息放到headers中
  const userStore = useUserStore()
  if (userStore.token) {
    config.headers.token = userStore.token
  }
  //返回配置对象
  return config
})
//添加响应拦截器
request.interceptors.response.use(
  //请求成功回调
  //可以简化返回的数据
  (response) => {
    return response.data
  },
  //请求失败回调
  //可以处理http网络错误
  (error) => {
    let message = ''
    const status = error.response.status
    switch (status) {
      case 401:
        message = 'Token过期'
        break
      case 403:
        message = '无权限'
        break
      case 404:
        message = '请求地址错误'
        break
      case 500:
        message = '服务器异常'
        break
      default:
        message = '网络异常'
        break
    }
    //提示错误信息
    ElMessage({
      type: 'error',
      message,
    })
    return Promise.reject(error)
  },
)

//region 完整配置
/*import axios from 'axios'
import { ElMessage } from 'element-plus'
//引入用户相关的仓库
import useUserStore from '@/store/modules/user'
//第一步:利用axios对象的create方法,去创建axios实例(其他的配置:基础路径、超时的时间)
const request = axios.create({
  //基础路径
  baseURL: import.meta.env.VITE_APP_BASE_API, //基础路径上会携带/api
  timeout: 5000, //超时的时间的设置
})
//第二步:request实例添加请求与响应拦截器
request.interceptors.request.use((config) => {
  //获取用户相关的小仓库:获取仓库内部token,登录成功以后携带给服务器
  const userStore = useUserStore()
  if (userStore.token) {
    config.headers.token = userStore.token
  }
  //config配置对象,headers属性请求头,经常给服务器端携带公共参数
  //返回配置对象
  return config
})

//第三步:响应拦截器
request.interceptors.response.use(
  (response) => {
    //成功回调
    //简化数据
    return response.data
  },
  (error) => {
    //失败回调:处理http网络错误的
    //定义一个变量:存储网络错误信息
    let message = ''
    //http状态码
    const status = error.response.status
    switch (status) {
      case 401:
        message = 'TOKEN过期'
        break
      case 403:
        message = '无权访问'
        break
      case 404:
        message = '请求地址错误'
        break
      case 500:
        message = '服务器出现问题'
        break
      default:
        message = '网络出现问题'
        break
    }
    //提示错误信息
    ElMessage({
      type: 'error',
      message,
    })
    return Promise.reject(error)
  },
)*/
//endregion

//对外暴露
export default request

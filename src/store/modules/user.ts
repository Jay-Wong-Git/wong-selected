//创建用户相关的小仓库
import { defineStore } from 'pinia'
//引入接口
import { reqLogin } from '@/api/user'
//引入数据类型
import { loginForm, loginResponseData } from '@/api/user/type'
import { UserState } from '@/store/modules/types/type'
//操作本地存储的工具方法
import { GET_TOKEN, SET_TOKEN } from '@/utils/token'
export default defineStore('User', {
  //存放数据
  state(): UserState {
    return {
      token: GET_TOKEN() || '', //用户的唯一标识
    }
  },
  //处理异步/逻辑
  actions: {
    //用户登录
    async userLogin(data: loginForm) {
      //发送登录请求
      let res: loginResponseData = await reqLogin(data)
      //登录成功，存储token
      if (res.code === 200) {
        //更新仓库
        this.token = res.data.token as string
        //持久化数据到本地
        SET_TOKEN(res.data.token as string)
        //保证当前async函数返回一个成功的Promise
        return 'ok'
      } else {
        //登录失败，返回错误信息
        return Promise.reject(new Error(res.data.message))
      }
    },
  },
  //计算属性
  getters: {},
})

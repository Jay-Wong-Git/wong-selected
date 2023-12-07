//创建用户相关的小仓库
import { defineStore } from 'pinia'
//引入请求接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import { UserState } from '@/store/modules/types/type'
//操作本地存储的工具方法
import { GET_TOKEN, REMOVE_TOKEN, SET_TOKEN } from '@/utils/token'
//引入常量路由
import { constRoutes } from '@/router/routes'
import { ElMessage } from 'element-plus'
import {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
} from '@/api/user/type'

export default defineStore('UserStore', {
  //存放数据
  state(): UserState {
    return {
      token: GET_TOKEN() || '', //用户的唯一标识
      constRoutes, //存储常量路由到仓库
      username: '', //用户名
      avatar: '', //头像地址
    }
  },
  //处理异步/逻辑
  actions: {
    //用户登录的方法
    async userLogin(data: loginFormData) {
      //发送登录请求
      const res: loginResponseData = await reqLogin(data)
      //登录成功，存储token
      if (res.code === 200) {
        //更新仓库
        this.token = res.data
        //持久化数据到本地
        SET_TOKEN(res.data)
        //保证当前async函数返回一个成功的Promise
        return 'ok'
      } else {
        //登录失败，返回错误信息
        return Promise.reject(new Error(res.data))
      }
    },
    //获取用户信息的方法
    async userInfo() {
      const res: userInfoResponseData = await reqUserInfo()
      if (res.code === 200) {
        //更新仓库
        this.username = res.data.name
        this.avatar = res.data.avatar
        //保证当前async函数返回一个成功的Promise
        return 'ok'
      } else {
        //登录失败，返回错误信息
        return Promise.reject(new Error(res.message))
      }
    },
    //用户退出登录的方法
    async userLogout() {
      //向服务器发送退出登录请求
      const res: any = await reqLogout()
      console.log(res)
      if (res.code === 200) {
        //清空仓库中的数据
        this.token = ''
        this.username = ''
        this.avatar = ''
        //清空浏览器本地存储中的token
        REMOVE_TOKEN()
        //保证当前async函数返回一个成功的Promise
        return 'ok'
      } else {
        //退出登录失败，返回错误信息
        return Promise.reject(new Error(res.message))
      }
    },
  },
  //计算属性
  getters: {},
})

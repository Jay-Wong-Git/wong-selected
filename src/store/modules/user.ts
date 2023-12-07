//创建用户相关的小仓库
import { defineStore } from 'pinia'
//引入接口
import { reqLogin, reqUserInfo } from '@/api/user'
//引入数据类型
import { loginForm, loginResponseData } from '@/api/user/type'
import { UserState } from '@/store/modules/types/type'
//操作本地存储的工具方法
import { GET_TOKEN, REMOVE_TOKEN, SET_TOKEN } from '@/utils/token'
//引入常量路由
import { constRoutes } from '@/router/routes'

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
    async userLogin(data: loginForm) {
      //发送登录请求
      const res: loginResponseData = await reqLogin(data)
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
    //获取用户信息的方法
    async userInfo() {
      const res = await reqUserInfo()
      if (res.code === 200) {
        //更新仓库
        this.username = res.data.checkUser.username
        this.avatar = res.data.checkUser.avatar
        //保证当前async函数返回一个成功的Promise
        return 'ok'
      } else {
        //登录失败，返回错误信息
        return Promise.reject(new Error(res.data.message))
      }
    },
    //用户退出登录的方法
    async userLogout() {
      //向服务器发送退出登录请求
      //清空仓库中的数据
      this.token = ''
      this.username = ''
      this.avatar = ''
      //清空浏览器本地存储中的token
      REMOVE_TOKEN()
    },
  },
  //计算属性
  getters: {},
})

<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login_form"
          :model="loginFormData"
          :rules="rules"
          ref="loginFormRef"
        >
          <h1>Hello</h1>
          <h2>Welcome to Wong Selected!</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginFormData.username"
              placeholder="account"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              :prefix-icon="Lock"
              v-model="loginFormData.password"
              show-password
              placeholder="password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="login_btn"
              type="primary"
              plain
              @click="login"
              :loading="isLoading"
            >
              Login
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
//引入用户相关的小仓库
import useUserStore from '@/store/modules/user'
import { ElNotification } from 'element-plus'
//获取当前时间的工具方法：早上/上午/下午/晚上
import { getTime } from '@/utils/time'
//获取用户相关仓库
const userStore = useUserStore()
//获取路由器
const $router = useRouter()
//获取路由对象
const $route = useRoute()
//收集账号和密码
const loginFormData = reactive({
  username: 'admin',
  password: '111111',
})
//获取登录表单对象
const loginFormRef = ref()
//自定义校验规则
//校验用户名
const validateUsername = (rule: any, value: any, callback: any) => {
  let regx = /^[a-zA-Z0-9]+$/
  if (regx.test(value)) {
    callback()
  } else {
    callback(new Error('The username can only contain letters and numbers.'))
  }
}

//定义表单校验配置对象
const rules = {
  username: [
    { required: true, message: 'Please input username', trigger: 'change' },
    { min: 2, max: 20, message: 'Length should be 2 to 20', trigger: 'change' },
    { validator: validateUsername, trigger: 'change' },
  ],
  password: [
    { required: true, message: 'Please input password', trigger: 'change' },
    { min: 6, max: 20, message: 'Length should be 6 to 20', trigger: 'change' },
  ],
}
//按钮是否处于加载状态
let isLoading = ref(false)
//登录按钮回调
const login = async () => {
  //校验登录表单，校验通过后才会发送请求
  await loginFormRef.value.validate()
  try {
    //切换按钮加载状态为true
    isLoading.value = true

    //通知仓库发送登录请求
    await userStore.userLogin(loginFormData)
    //切换按钮加载状态为false
    isLoading.value = false
    //展示首页数据或重定向到query参数指定的路径
    const redirect: any = $route.query.redirect
    await $router.push({ path: redirect ? redirect : '/' })
    // 弹出成功提示
    ElNotification({
      type: 'success',
      title: 'Login success!',
      duration: 1000,
      message: `Good ${getTime()}, ${userStore.username}! Welcome back!`,
    })
  } catch (e) {
    //登录失败弹出错误提示
    ElNotification({
      type: 'error',
      title: 'Login failed!',
      duration: 1000,
      message: (e as Error).message,
    })
    //切换按钮加载状态为false
    isLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background-ocean.jpg') no-repeat;
  background-size: cover;
  .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    padding: 30px;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    h1 {
      color: white;
      font-size: 40px;
    }
    h2 {
      color: white;
      font-size: 20px;
      margin: 20px 0;
    }
    .login_btn {
      width: 100%;
    }
  }
}
</style>

<template>
  <div class="login-wrap">
    <!-- 头部 -->
    <van-nav-bar
      title="标题"
    />
    <!-- 表单 -->
    <form >
      <van-cell-group>
        <van-field
          v-model="user.mobile"
          required
          clearable
          label="手机号"
          placeholder="请输入手机号"
          v-validate="required"
          name="mobile"
          :error-message="errors.first('mobile')"
        />
        <van-field
          v-model="user.code"
          type="password"
          label="密码"
          placeholder="请输入密码"
           v-validate="required"
          name="code"
          :error-message="errors.first('code')"
        />
      </van-cell-group>
       <div class="login-btn-box">
         <van-button
         class="login-btn"
          type="info"
          :loading="loginLoading"
          loading-text="加载中..."
          @click.prevent="handleLogin"
          >登录</van-button>
       </div>
    </form>
  </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '15036015854',
        code: '246810'
      },
      loginLoading: false, // 控制登录按钮的loading状态
      myErrors: {
        mobile: '',
        code: ''
      },
      required: ''
    }
  },
  created () {
    this.configFormErrorMessages()
  },
  methods: {
    async handleLogin () {
      try {
        // 发送请求之前，校验表单数据，校验通过，才进行登录
        // const { mobile, code } = this.user
        // 调用JavaScript触发验证
        const valid = await this.$validator.validate()
        // 如果校验失败，则停止后续代码执行
        if (!valid) {
          return
        }
        // const errors = this.errors

        // if (mobile.length) {
        //   errors.mobile = ''
        // } else {
        //   errors.mobile = '手机号不能为空'
        //   return
        // }

        // if (code.length) {
        //   errors.code = ''
        // } else {
        //   errors.code = '验证码不能为空'
        //   return
        // }

        // 表单验证通过，发送请求，loading加载
        this.loginLoading = true

        const data = await login(this.user)
        // 登录成功以后，提交moutation完成状态的修改
        this.$store.commit('setUser', data)

        // 先直接简单跳转到首页，真实的业务要跳转到之前过来的页面
        this.$router.push({
          name: 'home'
        })
      } catch (err) {
        console.log(err)
        // console.log('登录失败')
        this.$toast.fail('登录失败')
      }
      this.loginLoading = false
    },
    configFormErrorMessages () {
      const dict = {
        custom: {
          mobile: {
            required: '手机号不能为空'
          },
          code: {
            required: '密码不能为空'
          }
        }
      }
      // 如果需要错误消息提示全局生效
      // Validator.localize('en',dict)

      // 组件中也注册生效
      this.$validator.localize('zh_CN', dict)
    }
  }
}
</script>

<style lang="less" scoped>
.login-btn-box{
  padding: 20px;
  .login-btn{
    width: 100%;
  }
}
</style>

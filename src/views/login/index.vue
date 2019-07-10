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
        />
        <van-field
          v-model="user.code"
          type="password"
          label="密码"
          placeholder="请输入密码"
          required
        />
      </van-cell-group>
       <div class="login-btn-box">
         <van-button
         class="login-btn"
          type="info"
          @click.prevent="handleLogin"
          >登录</van-button>
       </div>
    </form>
  </div>
</template>

<script>
import { login } from '@/api/user'
// import { constants } from 'crypto'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '15036015854',
        code: '123456'
      }
    }
  },
  methods: {
    async handleLogin () {
      try {
        const data = await login(this.user)
        // 登录成功以后，提交moutation完成状态的修改
        this.$store.commit('setUser', data)

        // 先直接简单跳转到首页，真实的业务要跳转到之前过来的页面
        this.$router.push({
          name: 'home'
        })
      } catch (err) {
        console.log(err)
        console.log('登录失败')
      }
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

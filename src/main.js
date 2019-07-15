import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'

import Vant from 'vant'
import 'vant/lib/index.css'
import VeeValidate, { Validator } from 'vee-validate'
import zhCN from 'vee-validate/dist/locale/zh_CN'

Vue.use(VeeValidate, {
  events: '' // 禁用默认事件验证
  // event: 'change'
})
Validator.localize('zh_CN', zhCN)
Vue.use(Vant)

// 后面配置即为按需引入的方式（减小代码打包体积）
// import {
//   Button,
//   Tabbar,
//   TabbarItem
// } from 'vant'

// Vue
//   .use(Button)
//   .use(Tabbar)
//   .use(TabbarItem)

Vue.prototype.$sleep = time => {
  return new Promise((resolve, reject) => {
    window.setTimeout(resolve, time)
  })
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import './plugins/element.js'
// 导入发送请求模块
import axios from 'axios'
// 该模块可以转换为字符串
import qs from 'qs'

Vue.config.productionTip = false
// 设置vue的元属性，login.vue中的this为当前的vue对象
// $http为属性，当前已经赋值，可以在后面发送请求的时候使用this.$http进行使用
// 其中$之前的内容势固定的写法，$之后所跟的内容随便写，但是，在饮用的时候，必须书写正确
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
// 设置axios默认的url为flask后端服务器地址
// 设置一个请求拦截器，来设置token:发送请求对象，config相当于参数。=>参数执行体
axios.interceptors.request.use(
  config => {
    // 首先从sessionStorage获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if (tokenStr) {
      // 判断是否存在token，如果存在的话，每一个http请求，都会携带上token
      config.headers.token = tokenStr
    }
    return config
  }
)
// 设置一个相应的拦截器，来处理token是否有效，如果无效，就跳转登录界面，；如果有效，则继续下一步操作
axios.interceptors.response.use(
  response => {
    if (response.data.status === 10016 || response.data.status === 10017) {
      window.sessionStorage.removeItem('token')
      router.replace(
        {
          path: '/login'
        }
      )
    }
    return response
  }
)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

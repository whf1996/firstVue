// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/global.css'
// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入字体图标
import './assets/font/iconfont.css'
// 引入axios
import axios from 'axios'
import VueCookies from 'vue-cookies'

// 配置请求的根路径
axios.defaults.baseURL = 'http://www.hhh.com/management/'

// 使用注册element-ui
Vue.use(ElementUI)
Vue.use(VueCookies)
// axios 请求拦截器
// axios.interceptors.request.use(config => {
//   config.headers.Authorization = window.sessionStorage.getItem('token')
//   console.log(config)
//   return config
// })
// 挂载vue实例
Vue.prototype.$http = axios
Vue.prototype.$message = ElementUI.Message
Vue.prototype.$confirm = ElementUI.MessageBox.confirm
Vue.config.productionTip = false

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})

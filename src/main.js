import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'

import './assets/css/font_3922680_w1qddxgys6f/iconfont.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
// import request from './plugins/request'

axios.default.baseURL="http://127.0.0.1:9000"
Vue.prototype.$axios = axios
// Vue.prototype.$axios = axios
Vue.config.productionTip = false
// ElementUI.Dialog.props.lockScroll.default = false;

Vue.use(ElementUI)

router.beforeEach((to,from,next)=>{
    const token = window.sessionStorage.getItem("token")
      // console.log("to:",to.path)
      if(to.path==="/login") {
          return next()
      }

        console.log("token:",token)
      if(!token) return next("/login")
        return next()
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

import Vue from 'vue'
import App from './App.vue'
// import { VueReCaptcha } from 'vue-recaptcha-v3'

// Vue.use(VueReCaptcha, { siteKey: '6Lco3KkZAAAAAHALqcqtwbKJZXjVk6uJ9zaH2Q7e' })
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

import Vue from 'vue'
import App from './App.vue'
import Element from 'element-ui'

Vue.use(Element,{size: 'mini'})


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

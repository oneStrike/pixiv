import Vue from 'vue'
import App from './App'
import store from './vuex/store.js'

Vue.config.productionTip = false
Vue.filter('proxySrc',function(src){
  return src.replace('https://i.pximg.net/','http://18.183.179.232/pximg/')
})

App.mpType = 'app'

const app = new Vue({
  ...App,
  store
})
app.$mount()

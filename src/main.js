import Vue from 'vue'
import App from './App'
import store from './vuex/store.js'

import imageList from '@/components/common/imageList/imageList'

Vue.component('imageList', imageList)

Vue.config.productionTip = false
/*全局过滤器，代理P站的图片地址*/
Vue.filter('proxySrc', function (src) {
  return src.replace('https://i.pximg.net/', 'http://18.183.179.232/pximg/')
})

/*
* 获取组件的样式属性
* c = 组件的类名
* a = 选择器的选取范围，true为自定义组件
* https://uniapp.dcloud.net.cn/api/ui/nodes-info
* */
Vue.prototype.$componentStyle = function (c, a) {
  return new Promise((resolve, reject) => {
    let query = a ? uni.createSelectorQuery().in(this) : uni.createSelectorQuery()
    query.select(c).boundingClientRect((res) => {
      console.log(c,res);
      res ? resolve(res) : reject(res)
    }).exec()
  })
}

App.mpType = 'app'

const app = new Vue({
  ...App,
  store
})
app.$mount()

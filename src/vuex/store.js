import Vue from 'vue';
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    sideBarOptions: {load: 'full', layout: 'flow', floor: true}
  },
  mutations: {
    /*设置侧边栏的设置*/
    setSideBarOptions(state, data) {
      if(data.type){
        state.sideBarOptions[data.type] = data.value;
        uni.setStorageSync('sideBar', state.sideBarOptions);
      }else{
        state.sideBarOptions = data;
      }
    }
  },
  actions: {},
  getters: {},
})

export default store
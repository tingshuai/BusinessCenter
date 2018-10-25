import Vue from 'vue'
import app from './App.vue'
import 'element-ui/lib/theme-chalk/index.css'
import Element from 'element-ui'
import ajax from './api/base.js'
import router from './router/index.js'
import store from './store/index.js'
import 'babel-polyfill'

import page from './components/theme/page.vue'
Vue.config.productionTip = false
import 'babel-polyfill';
// Vue.prototype.rightMenu = function (e,self) {
//   this.$store.commit('SET_CONTEXTMENU_EVENT', e);
//   this.$store.commit('SET_CONTEXTMENU_TARGET',self);
//   this.$store.commit('SET_SHOW_CONTEXTMENU',true);
// }
Vue.use(Element);
Vue.component('Page',page)
new Vue({
  el: '#qwApp',
  router,
  store,
  components: { app }
})



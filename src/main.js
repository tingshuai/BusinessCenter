import Vue from 'vue'
import app from './App.vue'
import 'element-ui/lib/theme-chalk/index.css'
import Element from 'element-ui'
import ajax from './api/base.js'
import router from './router/index.js'
import store from './store/index.js'
import 'babel-polyfill'

import toolbars from './components/toolbars.vue' //工具栏
import pagetool from './components/pagetool.vue' //分页栏
import ClassifiedSearch from './components/ClassifiedSearch.vue' //分页栏
import myToast from './components/Toast.vue' //弹窗

import page from './components/theme/page.vue'
Vue.component('toolbars', toolbars)  //工具栏
Vue.component('PageTool', pagetool)  //分页栏
Vue.component('ClassifiedSearch', ClassifiedSearch)  //分页栏
Vue.component('myToast', myToast)  //弹窗
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



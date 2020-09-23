// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import WeVue from 'we-vue'
import 'we-vue/lib/style.css'
import router from './router'
import "./utils/alife"
Vue.config.productionTip = false
Vue.use(WeVue)

import './assets/css/base.css'

import Es6Promise from 'es6-promise'
Es6Promise.polyfill()
import 'babel-polyfill'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
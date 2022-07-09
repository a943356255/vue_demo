import Vue from 'vue'
import App from './App.vue'

import vuex from "vuex";
import VueRouter from "vue-router";
import router from "./router/index";
import store from "./store/index"

Vue.use(vuex);
Vue.use(VueRouter);
Vue.config.productionTip = false

import {
  Button,
  Input,
} from "element-ui";

Vue.use(Button);
Vue.use(Input);

// 在这里判断是否有权限，是否登录
import "./permission"

new Vue({
  render: h => h(App),
  router: router,
  store
}).$mount('#app')

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
  Menu,
  MenuItem,
  Submenu,
  Container,
  Header,
  Main,
  Pagination,
  MenuItemGroup,
  Aside,
  Table,
  TableColumn,
  Dialog,
  Form,
  FormItem,
  Select,
  Option,
  Checkbox,
  CheckboxGroup,
  CheckboxButton,
  Row,
  Col,
  Breadcrumb,
  BreadcrumbItem,
  Tag
} from "element-ui";

Vue.use(Button);
Vue.use(Input);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Container);
Vue.use(Header);
Vue.use(Main);
Vue.use(Pagination);
Vue.use(MenuItemGroup);
Vue.use(Aside);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Select);
Vue.use(Option);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(CheckboxButton);
Vue.use(Row);
Vue.use(Col);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Tag);

// 在这里判断是否有权限，是否登录
import "./permission";
import "./style/global.css";
import MyTable from "@/components/MyTable";

Vue.component(MyTable.name, MyTable);

new Vue({
  render: h => h(App),
  router: router,
  store,
  beforeCreate() {
    Vue.prototype.$bus = this
  },
}).$mount('#app')

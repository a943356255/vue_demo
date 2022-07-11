import Vue from "vue";
import Vuex from "vuex"

// 引入小仓库
import demo from "./demo/index"
import permission from "./permission"

Vue.use(Vuex);

export default new Vuex.Store({
    // 注册小仓库
    modules: {
        demo,
        permission
    }
})
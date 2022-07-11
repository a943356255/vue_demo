import { reqGetInfo, reqLogin } from "../../api/index"

// 存放数据
const state = {
    token: "",
    roles: "",
    pathList: [],
}

// 将处理好的数据提交给state
const mutations = {
    GETINFO(state, data) {
        state.roles = data.roles;
        state.pathList = data.pathList;
    },
    GETTOKEN(state, data) {
        state.token = data.token;
    }
}

// 写一些业务逻辑,然后将事件提交给mutations
const actions = {
    async getInfo({ commit }, token) {
        let result = await reqGetInfo(token);
        commit("GETINFO", result.data);
        console.log(result.data);
        return result.data;
    },
    async getToken({ commit }, data) {
        let result = await reqLogin(data);
        commit("GETTOKEN", result.data);
    }
}

const getters = {

}

export default {
    state,
    mutations,
    actions,
    getters
}
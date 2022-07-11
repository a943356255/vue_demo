import VueRouter from "vue-router"
import Login from "../pages/LoginAndRegister/Login.vue"
import Home from "../pages/Home"
import Del from "../pages/Del"
import Add from "../pages/Add"

// 保存VueRouter原来的push
let originPush = VueRouter.prototype.push

let originReplace = VueRouter.prototype.replace

// 重写push
VueRouter.prototype.push = function (location, resolve, reject) {
    // 传了后边两个参数还按原来的调用
    if (resolve && reject) {
        originPush.call(this, location, resolve, reject)
    } else {
        // 没有传递参数，则用空函数取代
        originPush.call(this, location, () => { }, () => { })
    }
}

VueRouter.prototype.replace = function (location, resolve, reject) {
    // 传了后边两个参数还按原来的调用
    if (resolve && reject) {
        originReplace.call(this, location, resolve, reject)
    } else {
        // 没有传递参数，则用空函数取代
        originReplace.call(this, location, () => { }, () => { })
    }
}

// 这里是存放不需要权限可以直接访问的路由
export const constantRouterMap = [
    {
        path: "/login",
        name: "login",
        component: Login
    },
    // 首页是否可以直接访问根据情况
    {
        path: "/home",
        name: "home",
        component: Home
    }
]

export const asyncRouterMap = [
    {
        path: "/del",
        component: Del,
        name: "del",
        meta: {
            // 超级管理员可以删除数据
            role: ["admin", "super_editor"]
        }
    },
    {
        path: "/add",
        name: "add",
        component: Add,
        meta: {
            // 普通管理员只能添加数据
            role: ["admin", "normal_editor"]
        }
    }
]

const router = new VueRouter({
    routes: constantRouterMap,
})

export default router
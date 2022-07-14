import VueRouter from "vue-router"
import Login from "../pages/LoginAndRegister/Login.vue"
import Home from "../pages/Home"
import Add from "../pages/Add"
import AuthManagement from "../pages/AuthManagement"
import GoodsManagement from "../pages/GoodsManagement"
import UserManagement from "../pages/UserManagement"

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
        path: "/role_management",
        name: "role_management",
        component: Add,
        meta: {
            // 普通管理员只能添加数据
            role: ["admin"]
        }
    },
    {
        path: "/auth_management",
        name: "auth_management",
        component: AuthManagement,
        meta: {
            // 普通管理员只能添加数据
            role: ["admin"]
        }
    },
    {
        path: "/goods_management",
        name: "goods_management",
        component: GoodsManagement,
        meta: {
            // 普通管理员只能添加数据
            role: ["admin", "normal_editor"]
        }
    },
    {
        path: "/user_management",
        name: "user_management",
        component: UserManagement,
        meta: {
            // 普通管理员只能添加数据
            role: ["admin"]
        }
    }
]

const router = new VueRouter({
    routes: constantRouterMap,
})

export default router
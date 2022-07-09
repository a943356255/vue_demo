import Login from "../pages/LoginAndRegister/Login.vue"
import Del from "../pages/Del"
import Add from "../pages/Add"

// 这里是存放不需要权限可以直接访问的路由
export const constantRouterMap = [
    {
        path: "/login",
        component: Login
    },
]

export const asyncRouterMap = [
    {
        path: "/del",
        component: Del,
        meta: {
            // 超级管理员可以删除数据
            role: ["admin", "super_editor"]
        }
    },
    {
        path: "/add",
        component: Add,
        meta: {
            // 普通管理员只能添加数据
            role: ["admin", "normal_editor"]
        }
    }
]
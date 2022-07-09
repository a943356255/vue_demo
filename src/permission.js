import router from "./router/index"
import store from "./store/index"

router.beforeEach((to, from, next) => {

    // 用于跳出循环
    if (to.meta == null || to.meta.length == undefined) {
        next();
    }

    // 判断是否携带token
    if (store.state.demo.token) {
        if (to.path === "/login") {
            next({ path: "/" })
        } else {
            const hasRoles = store.state.demo.roles && store.state.demo.roles.length > 0;
            if (hasRoles) {
                next();
            } else {
                store.dispatch("getInfo", store.state.demo.token).then(roles => {
                    // 生成可访问的路由表
                    store.dispatch("GenerateRoutes", roles).then(() => {
                        // 动态添加路由表
                        console.log("addRouters = ", store.state.permission.addRouters);
                        const arr = store.state.permission.addRouters;
                        // addRoute方法一次只能添加一个路由,所以要遍历
                        for (let i = 0; i < arr.length; i++) {
                            router.addRoute(arr[i]);
                        }
                        // router.addRoute(store.state.permission.addRouters);
                        next({ ...to, replace: true });
                    })
                }).catch(err => {
                    console.log(err);
                })
            }
        }
    } else {
        // 没有token
        next({ path: "/login" })
    }
})
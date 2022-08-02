import router from "./router/index"
import store from "./store/index"
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

NProgress.configure({ showSpinner: false })

router.beforeEach((to, from, next) => {

    // 用于跳出循环
    // if (to.meta == null || to.meta.length === undefined) {
    //     next()
    // }

    console.log("to = ", to, "from = ", from, "next = ", next())
    NProgress.start()

    // 判断是否携带token
    if (store.state.demo.token) {
        if (to.path === "/login") {
            next({ path: "/home" })
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
                        console.log(router)
                        for (let i = 0; i < arr.length; i++) {
                            // 添加到home的子路由
                            router.options.routes[1].children.push(arr[i])
                            // router.addRoute(arr[i]);
                        }
                        // 重新挂载路由
                        for (let i = 0; i < router.options.routes.length; i++) {
                            router.addRoute(router.options.routes[i]);
                        }
                        // router.addRoute(store.state.permission.addRouters);
                        next({ ...to, replace: true });
                    })
                }).catch(err => {
                    console.log(err);
                    NProgress.done()
                })
            }
        }
    } else {
        // 没有token
        next({ path: "/login" })
        NProgress.done()
    }
})

router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})
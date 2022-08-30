import {asyncRouterMap, constantRouterMap} from "@/router";
import {reqGetComponents} from "@/api";

// roles是用户所拥有的权限，route是路由，meta属性包含了能访问它的权限
function hasPermission(roles, route) {
    // 这里可能是数组，可能是单个,取决于该用户有多少种权限
    console.log("roles = ", roles);
    // 这里是一个数组
    console.log("route = ", route.meta.role);
    if (route.meta && route.meta.role) {
        // 判断是否包含对应权限
        return route.meta.role.some(role => role == roles);
    } else {
        // 没有meta属性说明都可以访问
        return true;
    }
}

const permission = {
    state: {
        // 有权限才可以访问的路由
        routers: constantRouterMap,
        addRouters: []
    },
    mutations: {
        SET_ROUTERS(state, routers) {
            // 这里的路由是需要动态添加的
            state.addRouters = routers;
            // 这里的路由是普通路由，都可以访问
            state.routers = constantRouterMap.concat(routers);
        }
    },
    actions: {
        async GenerateRoutes({commit}, data) {
            // 查询用户动态添加的路由
            let result = await reqGetComponents();
            console.log(result);
            let routerList = result.data.data
            for (let i = 0; i < routerList.length; i++) {
                let str = "Test/index"
                let selectRouter = {
                    path: routerList[i].path,
                    name: routerList[i].name,
                    component: () => import(`../../pages/${str}`),
                    meta: routerList[i].meta
                }
                asyncRouterMap.push(selectRouter)
            }

            // let obj = {
            //     path: "/test",
            //     name: "test",
            //     component: () => import('../../pages/Test/index'),
            //     meta: {
            //         roles: ["admin"]
            //     },
            // }
            // asyncRouterMap.push(obj);

            // roles应该是请求到的用户拥有的权限
            const roles = data.roles;
            // 过滤完成后返回一个存有用户可以访问的路由数组
            const accessedRouters = asyncRouterMap.filter(v => {
                // 是admin，放行
                if (roles.indexOf("admin") >= 0) {
                    return true;
                }
                // 进行匹配，匹配到直接返回权限,这里的v是指asyncRouterMap中配置的需要权限的路由
                if (hasPermission(roles, v)) {
                    // 存在子路由
                    if (v.children && v.children.length > 0) {
                        // 遍历子路由，找到有权限的路由
                        v.children = v.children.filter(child => {
                            if (hasPermission(roles, child)) {
                                return child
                            }
                            return false;
                        });
                    }
                    return v;
                }
                // 既不是admin，也没有匹配到权限，返回false
                return false;
            })
            await commit("SET_ROUTERS", accessedRouters);
        }
    },
}

export default permission;
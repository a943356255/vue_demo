import axios from "axios";
import store from "@/store";

const requests = axios.create({
    // 请求超时时间
    timeout: 5000,
});

// 请求拦截器：在发出请求前会进行拦截，可以进行一些操作
requests.interceptors.request.use((config) => {

    console.log("token=", store.state.demo.token);

    if (store.state.demo.token) {
        config.headers.token = store.state.demo.token
    }

    // config是配置对象，里边包含了一个header请求头
    return config
})

// 响应拦截器
requests.interceptors.response.use((res) => {
    // 响应成功的回调函数
    return res
}, (error) => {
    // 响应失败的回调函数
    return Promise.reject(new Error("faile"))
})

export default requests
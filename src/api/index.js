import requests from "./requests";

export const reqGetInfo = (token) => {
    return requests({
        url: "api/user/getInfo",
        method: "POST",
        params: {
            token: token
        }
    })
}

export const reqLogin = (value) => {
    return requests({
        url: "api/user/login",
        method: "POST",
        data: {
            phone: value.phone,
            password: value.password
        }
    })
}
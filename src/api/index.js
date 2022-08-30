import requests from "./requests";

export const reqGetInfo = (token) => {
    return requests({
        url: "api/user/getInfo",
        method: "POST",
        data: {
            token: token
        }
    })
}

export const reqLogin = (value) => {
    return requests({
        url: "api/user/login",
        method: "POST",
        data: {
            username: value.phone,
            password: value.password,
            rememberMe: value.rememberMe
        }
    })
}

export function reqGetRole() {
    return requests({
        url: "api/user/getRoles",
        method: "POST",
    })
}

export const reqInsertController = (data) => {
    return requests({
        url: "api/user/insertController",
        method: "POST",
        data: {
            checkedRoles: data.checkedRoles,
            controller: data.controller
        }
    })
}

export const reqGetComponents = () => {
    return requests({
        url: "api/user/getRouter",
        method: "POST"
    })
}
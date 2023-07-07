'use strict'

import {call2} from "./api.mjs";

export const register = async (phone, inviter) => {
    const r = await call2({
        path: "/v1/user/register",
        method: "POST",
        body: {
            phone: phone,
            password: "123456",
            smsCode: "2065"
        },
    })
    return r.accessToken
}

export const login = async (phone) => {
    const r = await call2({
        path: "/v1/user/login",
        method: "POST",
        body: {
            phone: phone,
            password: "123456"
        }
    })
    return r.accessToken
}

export const getOverview = async (userId) => {
    const config = {
        method: "GET",
        path: "/v1/user/overview"
    }
    if (userId !== undefined && userId !== null) {
        config.query = {id: userId}
    }
    return await call2(config)
}
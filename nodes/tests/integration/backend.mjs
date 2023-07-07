'use strict'

import {call2} from "./api.mjs";
import {token} from "./token.mjs";

export const adminRegister = async (username) => {
    const r = await call2({
        method: "POST",
        path: '/backend/v1/admin/register',
        body: {
            username: username,
            password: "123456"
        }
    })
    return r.accessToken
}

export const adminLogin = async (username) => {
    const r = await call2({
        method: "POST",
        path: '/backend/v1/admin/login',
        body: {
            username: username,
            password: "123456"
        }
    })
    return r.accessToken
}

const backendCall = async ({method, path, query, body, authentication}) => {
    if (authentication === undefined || authentication === null) {
        authentication = token.adminToken
    }
    return await call2({path, query, body, authentication, method})
}

export const getCommissionConfig = async () => {
    return await backendCall({
        method: "GET",
        path: '/backend/v1/api/promotion/commission/list',
    })
}
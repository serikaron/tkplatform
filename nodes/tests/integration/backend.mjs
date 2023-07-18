'use strict'

import {call2} from "./api.mjs";
import {token} from "./token.mjs";

const backendCall = async ({method, path, query, body, authentication}) => {
    if (authentication === undefined || authentication === null) {
        authentication = token.adminToken
    }
    return await call2({path, query, body, authentication, method})
}

// ------------  user  ----------------

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

export const getUsersBackend = async ({keyword, offset, limit}) => {
    return await call2({
        method: 'GET',
        path: '/backend/v1/users',
        query: {keyword, offset, limit}
    })
}

// ------------  site  ----------------

export const addSite = async (site) => {
    return await backendCall({
        method: "POST",
        path: '/backend/v1/site',
        body: site
    })
}

export const getSites = async ({keyword, offset, limit} = {}) => {
    return await backendCall({
        method: "GET",
        path: '/backend/v1/sites',
        query: {keyword, offset, limit}
    })
}

export const updateSite = async (siteId, site) => {
    return await backendCall({
        method: "PUT",
        path: `/backend/v1/site/${siteId}`,
        body: site
    })
}

// ------------  payment  ----------------

export const addCash = async (userId, cash) => {
    return await backendCall({
        method: "POST",
        path: "/backend/v2/wallet/cash",
        body: {userId, cash}
    })
}

export const getCommissionConfig = async () => {
    return await backendCall({
        method: "GET",
        path: '/backend/v1/api/promotion/commission/list',
    })
}

export const getWithdrawRecord = async ({orderId, phone, status, offset, limit}) => {
    return await backendCall({
        method: "GET",
        path: "/backend/v2/withdraw/records",
        query: {orderId, phone, status, offset, limit}
    })
}

export const getWithdrawFee = async () => {
    return await backendCall({
        method: "GET",
        path: '/backend/v1/api/withdraw/fee/setting'
    })
}

export const auditWithdrawal = async (recordId, status) => {
    return await backendCall({
        method: "PUT",
        path: `/backend/v2/withdraw/record/${recordId}`,
        body: {status}
    })
}
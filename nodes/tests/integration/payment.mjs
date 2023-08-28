'use strict'

import {baseURL, call2} from "./api.mjs";
import axios from "axios";

const callAlipay = async (productType, productId) => {
    return await call2({
        method: "POST",
        path: "/v2/alipay",
        body: {productType, productId},
    })
}

const alipayCallback = async (orderId) => {
    await axios.post(`${baseURL}/alipay/callback`,
        {out_trade_no: orderId},
        {headers: {'content-type': 'application/x-www-form-urlencoded'}}
    )
}
export const payMember = async (productId) => {
    const r = await callAlipay(1, productId)
    await alipayCallback(r.orderId)
}

export const payRice = async (produceId) => {
    const r = await callAlipay(2, produceId)
    await alipayCallback(r.orderId)
}

export const getMemberItems = async () => {
    return await call2({
        method: "GET",
        path: "/v1/store/member/items",
    })
}

export const getRiceItems = async () => {
    return await call2({
        method: "GET",
        path: '/v1/store/rice/items',
    })
}

export const getWalletOverview = async (authentication) => {
    return await call2({
        method: "GET",
        path: "/v1/wallet/overview",
        authentication
    })
}

export const getWallet = async (authentication) => {
    return await call2({
        method: "GET",
        path: '/v1/wallet',
        authentication
    })
}

export const getPaymentRecord = async ({phone, offset, limit}) => {
    return await call2({
        method: "GET",
        path: '/backend/v2/payment/records',
        query: {phone, offset, limit}
    })
}

export const getRiceRecord = async ({phone, offset, limit}) => {
    return await call2({
        method: "GET",
        path: '/backend/v2/rice/records',
        query: {phone, offset, limit}
    })
}

export const getMemberRecord = async ({phone, offset, limit}) => {
    return await call2({
        method: "GET",
        path: '/backend/v2/member/records',
        query: {phone, offset, limit}
    })
}

export const getWithdrawRecordsApp = async ({offset, limit, authentication}) => {
    return await call2({
        method: "GET",
        path: '/v1/wallet/withdraw/records',
        query: {offset, limit},
        authentication
    })
}

export const withdraw = async (amount) => {
    return await call2({
        method: "POST",
        path: '/v2/withdraw',
        body: {amount}
    })
}

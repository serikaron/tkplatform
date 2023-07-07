'use strict'

import {baseURL, call2} from "./api.mjs";
import {token} from "./token.mjs";
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

export const getMemberItems = async () => {
    return await call2({
        method: "GET",
        path: "/v1/store/member/items",
    })
}

export const getWalletOverview = async () => {
    return await call2({
        method: "GET",
        path: "/v1/wallet/overview"
    })
}
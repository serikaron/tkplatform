'use strict'

import {sign} from "alipay-sdk/lib/util.js";

export const callAlipay = async (context, method, bizContent) => {
    const alipayConfig = await context.alipay.getConfig()
    console.log(`alipayConfig: ${JSON.stringify(alipayConfig)}`)
    return await sign(method, {
        notifyUrl: "http://tk.haikuotiank.com:9000/alipay/callback",
        bizContent,
    }, alipayConfig)
}

export const alipayTrade = async (context, bizContent) => {
    return await callAlipay(context, "alipay.trade.app.pay", bizContent)
}
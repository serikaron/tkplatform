'use strict'

import {ObjectId} from "mongodb";
import {TKResponse} from "../../common/TKResponse.mjs";
import {InternalError} from "../../common/errors/00000-basic.mjs";
import fs from 'fs/promises'
import {sign} from "alipay-sdk/lib/util.js";

export const routePay = (router) => {
    router.post('/alipay', async (req, res, next) => {
        try {
            const tradeId = new ObjectId()
            const method = "alipay.trade.app.pay"
            const bizContent = {
                out_trade_no: tradeId.toString(),
                total_amount: "0.01",
                subject: "测试支付",
            }
            // const result = await req.context.alipay.exec("alipay.trade.app.pay", {
            //     returnUrl: 'https://www.baidu.com',
            // })

            const alipayConfig = await req.context.alipay.getConfig()
            console.log(`alipayConfig: ${JSON.stringify(alipayConfig)}`)
            const data = await sign(method, {
                bizContent,
            }, alipayConfig)

            const payInfo = new URLSearchParams(data).toString()

            res.tkResponse(TKResponse.Success({
                data: {orderStr: payInfo},
            }))

        } catch (e) {
            console.log(e)
            fs.writeFile("/out/err.log", e.serverResult.data)
            res.tkResponse(TKResponse.fromError(new InternalError()))
        }
        next()
    })
}
'use strict'

import {ObjectId} from "mongodb";
import {TKResponse} from "../../common/TKResponse.mjs";
import {InternalError, InvalidArgument} from "../../common/errors/00000-basic.mjs";
import fs from 'fs/promises'
import {sign} from "alipay-sdk/lib/util.js";
import {ItemNotFound} from "../../common/errors/40000-payment.mjs";
import {alipayTrade} from "../alipay.mjs";

const buildMemberItem = async (req) => {
    const memberItem = req.context.mongo.getMemberItem(req.body.productId)
    if (memberItem === null) {
        throw new ItemNotFound()
    }

    req.bill = {
        log: {
            amount: memberItem.price,
            item: {
                id: memberItem._id,
                days: memberItem.days,
            }
        },
        bizContent: {
            total_amount: memberItem.price.toString(),
            subject: memberItem.name
        }
    }
}

const buildRiceItem = async (req) => {
    const riceItem = req.context.mongo.getRiceItem(req.body.productId)
    if (riceItem === null) {
        throw new ItemNotFound()
    }

    req.bill = {
        log: {
            amount: riceItem.price,
            item: {
                id: riceItem._id,
                rice: riceItem.rice,
            }
        },
        bizContent: {
            total_amount: riceItem.price.toString(),
            subject: riceItem.name
        }
    }
}

const buildItem = async (req, res, next) => {
    switch (req.body.productType) {
        case 1: buildMemberItem(req)
        case 2: buildRiceItem(req)
        default: throw new InvalidArgument()
    }
    next()
}

const addLog = async (req, res, next) => {
    req.bizContent.out_trade_no = await req.context.mongo.addPayLog(req.headers.id, req.bill.log.amount, req.body.productType, req.bill.log.item)
    next()
}

const pay = async (req, res, next) => {
    const data = await alipayTrade(req.context, req.bill.bizContent)
    console.log(JSON.stringify(data))

    res.tkResponse(TKResponse.Success({
        orderStr: new URLSearchParams(data).toString(),
        orderId: req.bill.bizContent.out_trade_no
    }))

    next()
}

export const routePay = (router) => {
    router.post('/alipay', ...[
        buildItem, addLog, pay
    ])
    const f = async(req, res, next) => {
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
                notifyUrl: "http://tk.haikuotiank.com:9000/alipay/callback",
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
    }
}
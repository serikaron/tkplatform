'use strict'

import {ObjectId} from "mongodb";
import {TKResponse} from "../../common/TKResponse.mjs";
import {InternalError, InvalidArgument} from "../../common/errors/00000-basic.mjs";
import fs from 'fs/promises'
import {sign} from "alipay-sdk/lib/util.js";
import {ItemNotFound} from "../../common/errors/40000-payment.mjs";
import {alipayTrade} from "../alipay.mjs";
import {itemTypeMember, itemTypeRice, itemTypeSearch, itemTypeTest} from "../itemType.mjs";
import {makeMiddleware} from "../../common/flow.mjs";

const buildTestItem = (req) => {
    req.bill = {
        log: {
            amount: "0.01",
            item: {}
        },
        bizContent: {
            total_amount: "0.01",
            subject: "测试支付"
        }
    }
}
const getStoreItem = async (stubFn, userId, itemId) => {
    const itemRsp = await stubFn(userId)
    if (itemRsp.isError()) {
        return null
    }

    for (const item of itemRsp.data) {
        if (item.id === itemId) {
            return item
        }
    }

    return null
}
const buildMemberItem = async (req) => {
    const memberItem = await getStoreItem(req.context.stubs.apid.getMemberItems, req.headers.id, req.body.productId)
    if (memberItem === null) {
        throw new ItemNotFound()
    }

    req.bill = {
        log: {
            amount: memberItem.price,
            item: {
                id: memberItem.id,
                days: memberItem.days,
                title: memberItem.name,
            }
        },
        bizContent: {
            total_amount: memberItem.price.toString(),
            subject: memberItem.name
        }
    }
}

const buildRiceItem = async (req) => {
    const riceItem = await getStoreItem(req.context.stubs.apid.getRiceItems, req.headers.id, req.body.productId)
    if (riceItem === null) {
        throw new ItemNotFound()
    }

    req.bill = {
        log: {
            amount: riceItem.price,
            item: {
                id: riceItem.id,
                rice: riceItem.rice,
                title: riceItem.name
            }
        },
        bizContent: {
            total_amount: riceItem.price.toString(),
            subject: riceItem.name
        }
    }
}

const buildSearchItem = async (req) => {
    req.bill = {
        log: {
            amount: "0.1",
            item: {}
        },
        bizContent: {
            total_amount: "0.1",
            subject: "查号"
        }
    }
}

const buildItem = async (req) => {
    switch (req.body.productType) {
        case itemTypeTest: buildTestItem(req); break
        case itemTypeMember: await buildMemberItem(req); break
        case itemTypeRice: await buildRiceItem(req); break
        case itemTypeSearch: await buildSearchItem(req); break
        default: throw new InvalidArgument()
    }
}

const addLog = async (req) => {
    const orderId = await req.context.mongo.addPayLog(req.headers.id, req.bill.log.amount, req.body.productType, req.bill.log.item)
    req.bill.bizContent.out_trade_no = orderId.toString()
}

const pay = async (req, res) => {
    const data = await alipayTrade(req.context, req.bill.bizContent)
    console.log(JSON.stringify(data))

    res.tkResponse(TKResponse.Success({
        data: {
            orderStr: new URLSearchParams(data).toString(),
            orderId: req.bill.bizContent.out_trade_no
        }
    }))
}

export const routePay = (router) => {
    router.post('/alipay', async (req, res, next) => {
        await buildItem(req)
        await addLog(req)
        await pay(req, res)
        next()
    })
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
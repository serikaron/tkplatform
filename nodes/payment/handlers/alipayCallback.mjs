'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {completedStatus, isPendingStatus, payedStatus} from "../logStatus.mjs";
import {itemTypeMember, itemTypeRice, itemTypeSearch} from "../itemType.mjs";
import {AlipayCallback} from "../../common/errors/40000-payment.mjs";

const memberPayed = async (req, log) => {
    const rsp = await req.context.stubs.user.addMember(log.userId, log.item.days)
    if (rsp.isError()) {
        throw new AlipayCallback(`add user member failed, orderId:${log._id}, userId:${log.userId}`)
    }
    await req.context.mongo.updateLogStatus(log._id, completedStatus)
}

const ricePayed = async (req, log) => {
    await req.context.mongo.addRice(log.userId, log.item.rice)
    await req.context.mongo.updateLogStatus(log._id, completedStatus)
}

const searchPayed = async (req, log) => {
    await req.context.mongo.updateLogStatus(log._id, payedStatus)
}

const handleCallback = async (req) => {
    console.log(`alipay callback: ${JSON.stringify(req.body)}`)
    const orderId = req.body.out_trade_no
    console.log(`orderId: ${orderId}`)
    const log = await req.context.mongo.getPayLog(orderId)
    console.log(`pay log: ${JSON.stringify(log)}`)
    if (log === null) {
        throw new AlipayCallback(`pay log not found, orderId:${orderId}`)
    }

    if (!isPendingStatus(log.status)) {
        throw new AlipayCallback(`invalid log status, orderId:${orderId}, status:${log.status}`)
    }

    switch (log.itemType) {
        case itemTypeMember: await memberPayed(req, log); break
        case itemTypeRice: await ricePayed(req, log); break
        case itemTypeSearch: await searchPayed(req, log); break
        default:
            throw new AlipayCallback(`invalid itemType:${log.itemType}, orderId:${orderId}`)
    }
}

export const routeAlipayCallback = (router) => {
    router.post("/alipay/callback", async (req, res, next) => {
        try {
            await handleCallback(req)
        } catch (e) {
            console.log(e)
            console.log(`ERROR, alipay callback, ${e.msg}`)
        }

        res.tkResponse(TKResponse.Success())
        next()
    })
}
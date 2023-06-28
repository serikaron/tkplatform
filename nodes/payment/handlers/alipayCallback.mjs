'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {completedStatus, isPendingStatus, payedStatus} from "../logStatus.mjs";
import {itemTypeMember, itemTypeRice, itemTypeSearch, itemTypeTest} from "../itemType.mjs";
import {AlipayCallback} from "../../common/errors/40000-payment.mjs";
import {UserNotExists} from "../../common/errors/10000-user.mjs";
import {InternalError, InvalidArgument} from "../../common/errors/00000-basic.mjs";

const getRate = (setting, level) => {
    switch (level) {
        case 1: return setting.rate1
        case 2: return setting.rate2
        case 3: return setting.rate3
        default: return null
    }
}

const getBaseRate = (settings, level) => {
    const getBaseSetting = () => {
        for (const s of settings) {
            if (s.commissionType === 1) {
                return s
            }
        }
        return null
    }
    const baseSetting = getBaseSetting()
    if (baseSetting === null) {
        console.log("ERROR, updateCommission, getBaseSetting FAILED !!!")
        throw new InternalError()
    }

    const baseRate = getRate(baseSetting, level)
    if (baseRate === null) {
        console.log("ERROR, updateCommission, getBaseRate FAILED !!!")
        throw new InternalError()
    }
    return baseRate
}

const getPlusRate = async (req, settings, level, userId) => {
    const upLineRsp = await req.context.stubs.user.getUser(userId)
    if (upLineRsp.isError()) {
        throw new UserNotExists()
    }

    const upLine = upLineRsp.data
    const downLineCount = upLine.downLines.length
    const l = settings.filter( x => x.commissionType === 2)
        .filter( x => x.peopleNumber <= downLineCount)
        .sort((a, b) => {
            if (a.peopleNumber > b.peopleNumber) { return -1 }
            if (a.peopleNumber < b.peopleNumber) { return 1 }
            return 0
        })

    if (l.length === 0) {
        return 0
    }

    const rate = getRate(l[0], level)
    return rate === null ? 0 : rate
}
const updateCommission = async (req, price, userId, level, settings) => {
    const userRsp = await req.context.stubs.user.getUser(userId)
    if (userRsp.isError()) {
        throw new UserNotExists()
    }

    const user = userRsp.data
    if (user.upLine === null || user.upLine === undefined) {
        console.log(`skip, user(${userId}) no up line`)
        return
    }

    const baseRate = getBaseRate(settings, level)
    const plusRate = await getPlusRate(req, settings, level, user.upLine)
    const rate = baseRate + plusRate

    const priceNum = Number(price)
    if (isNaN(priceNum)) {
        console.log(`ERROR, invalid price(${price})`)
        throw new InternalError()
    }

    const commission = Math.floor(priceNum * rate) / 100
    console.log(`updateCommission, price:${price}, baseRate:${baseRate}, plusRate:${plusRate}, commission:${commission}`)
    await req.context.mongo.addCash(user.upLine, commission)

    if (level !== 3) {
        await updateCommission(req, price, user.upLine, level+1, settings)
    }
}

const handleCommission = async (req, price, userId) => {
    const settingsRsp = await req.context.stubs.apid.getCommissionList()
    if (settingsRsp.isError()) {
        console.log("ERROR, handleCommission, getCommissionList FAILED !!!")
        throw new InternalError()
    }

    console.log(`settings: ${JSON.stringify(settingsRsp.data)}`)
    await updateCommission(req, price, userId, 1, settingsRsp.data)
}

const memberPayed = async (req, log) => {
    const rsp = await req.context.stubs.user.addMember(log.userId, log.item.days)
    if (rsp.isError()) {
        throw new AlipayCallback(`add user member failed, orderId:${log._id}, userId:${log.userId}`)
    }
    await handleCommission(req, log.amount, log.userId)
    await req.context.mongo.updateLogStatus(log._id, completedStatus)
}

const ricePayed = async (req, log) => {
    await req.context.mongo.addRice(log.userId, log.item.rice)
    await handleCommission(req, log.amount, log.userId)
    await req.context.mongo.updateLogStatus(log._id, completedStatus)
}

const searchPayed = async (req, log) => {
    await req.context.mongo.updateLogStatus(log._id, payedStatus)
}

const testPayed = async (req, log) => {
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
        case itemTypeTest: await testPayed(req, log); break
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
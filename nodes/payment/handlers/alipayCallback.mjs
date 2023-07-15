'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {completedStatus, isPendingStatus, payedStatus} from "../logStatus.mjs";
import {itemTypeMember, itemTypeRice, itemTypeSearch, itemTypeTest} from "../itemType.mjs";
import {AlipayCallback} from "../../common/errors/40000-payment.mjs";
import {UserNotExists} from "../../common/errors/10000-user.mjs";
import {InternalError} from "../../common/errors/00000-basic.mjs";
import {addWalletRecord, memberRecordBuilder, riceRecordBuilder} from "../walletRecords.mjs";
import {
    addMemberRecordMember,
    addPaymentRecordCommissionMember, addPaymentRecordCommissionRice,
    addPaymentRecordMember, addPaymentRecordRice, addRiceRecordRice,
} from "../backendRecords.mjs";
import {parseMoney} from "../../common/utils.mjs";

const getRate = (setting, level) => {
    switch (level) {
        case 1:
            return setting.rate1
        case 2:
            return setting.rate2
        case 3:
            return setting.rate3
        default:
            return null
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
    const l = settings.filter(x => x.commissionType === 2)
        .filter(x => x.peopleNumber <= downLineCount)
        .sort((a, b) => {
            if (a.peopleNumber > b.peopleNumber) {
                return -1
            }
            if (a.peopleNumber < b.peopleNumber) {
                return 1
            }
            return 0
        })

    if (l.length === 0) {
        return 0
    }

    const rate = getRate(l[0], level)
    return rate === null ? 0 : rate
}

const buildCommissionInfo = async (req, userId, price, settings) => {
    const userRsp = await req.context.stubs.user.getUser(userId)
    if (userRsp.isError()) {
        throw new UserNotExists()
    }
    const user = userRsp.data

    const upLines = []
    let upLineId = user.upLine
    let level = 1
    while (upLineId !== undefined && level <= 3) {
        console.log(`upLineId: ${upLineId}, level:${level}`)
        const upLineRsp = await req.context.stubs.user.getUser(upLineId)
        if (upLineRsp.isError()) {
            throw new UserNotExists()
        }

        const upLine = upLineRsp.data
        upLine.id = upLine._id

        const baseRate = getBaseRate(settings, level)
        const plusRate = await getPlusRate(req, settings, level, user.upLine)
        const rate = baseRate + plusRate

        const priceNum = Number(price)
        if (isNaN(priceNum)) {
            console.log(`ERROR, invalid price(${price})`)
            throw new InternalError()
        }

        const commission = Math.floor(priceNum * rate)

        upLines.push({upLine, commission})

        upLineId = upLine.upLine
        level += 1
    }

    return {
        payUser: user,
        upLines: upLines
    }
}

const addCommissionCash = async (req, info) => {
    for (const x of info.upLines) {
        await req.context.mongo.addCash(x.upLine.id, x.commission)
    }
}

const addCommissionRecord = async (req, info, log) => {
    for (const i in info.upLines) {
        const level = Number(i) + 1
        const x = info.upLines[i]
        switch (log.itemType) {
            case itemTypeMember:
                await addPaymentRecordCommissionMember(req.context, x.upLine.id, x.commission, level, info.payUser.phone)
                break
            case itemTypeRice:
                await addPaymentRecordCommissionRice(req.context, x.upLine.id, x.commission, level, info.payUser.phone)
                break
            default:
                break
        }
    }
}

const handleCommission = async (req, log) => {
    const settingsRsp = await req.context.stubs.apid.getCommissionList()
    if (settingsRsp.isError()) {
        console.log("ERROR, handleCommission, getCommissionList FAILED !!!")
        throw new InternalError()
    }

    const settings = settingsRsp.data
    const commissionInfo = await buildCommissionInfo(req, log.userId, log.amount, settings)
    await addCommissionCash(req, commissionInfo)
    await addCommissionRecord(req, commissionInfo, log)
}

const memberPayed = async (req, log) => {
    const rsp = await req.context.stubs.user.addMember(log.userId, log.item.days)
    if (rsp.isError()) {
        throw new AlipayCallback(`add user member failed, orderId:${log._id}, userId:${log.userId}`)
    }
    await req.context.mongo.updateLogStatus(log._id, completedStatus)
    await addWalletRecord(req, log, memberRecordBuilder)
    await req.context.mongo.incRecharge(log.userId, Number(log.amount) * 100)
    await addPaymentRecordMember(req.context, log.userId, Number(log.amount) * 100)
    await addMemberRecordMember(req.context, log.userId, log.item.days)
    await handleCommission(req, log)
}

const ricePayed = async (req, log) => {
    await req.context.mongo.addRice(log.userId, log.item.rice)
    await req.context.mongo.updateLogStatus(log._id, completedStatus)
    await addWalletRecord(req, log, riceRecordBuilder)
    await req.context.mongo.incRecharge(log.userId, Number(log.amount) * 100)
    await addPaymentRecordRice(req.context, log.userId, parseMoney(log.amount))
    await addRiceRecordRice(req.context, log.userId, log.item.rice)
    await handleCommission(req, log)
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
        case itemTypeTest:
            await testPayed(req, log);
            break
        case itemTypeMember:
            await memberPayed(req, log);
            break
        case itemTypeRice:
            await ricePayed(req, log);
            break
        case itemTypeSearch:
            await searchPayed(req, log);
            break
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
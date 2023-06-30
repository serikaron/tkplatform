'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {recordTypeDownLine, recordTypeMember, recordTypeRice, recordTypeWithdraw} from "../itemType.mjs";

const sumWallet = async (req, type, fn) => {
    const records = await req.context.mongo.getWalletRecordWithType(req.headers.id, type)
    return records.reduce((prev, curr) => {
        return prev + fn(curr)
    }, 0)
}

const sumIncome = async (req) => {
    return await sumWallet(req, recordTypeDownLine, (record) => {
        return record.hasOwnProperty("downLine") && record.downLine.hasOwnProperty("amount") ?
            record.downLine.amount : 0
    })
}

const sumWithdraw = async (req) => {
    return await sumWallet(req, recordTypeWithdraw, (record) => {
        return record.hasOwnProperty("withdraw") && record.withdraw.hasOwnProperty("amount") ?
            record.withdraw.amount : 0
    })
}

const sumRecharge = async (req) => {
    return await sumWallet(req, recordTypeRice, (record) => {
            return record.hasOwnProperty("rice") && record.rice.hasOwnProperty("price") ?
                record.rice.price : 0
        })
        +
        await sumWallet(req, recordTypeMember, (record) => {
            return record.hasOwnProperty("member") && record.member.hasOwnProperty("price") ?
                record.member.price : 0
        })
}

export const routeGetWalletOverview = router => {
    router.get('/wallet/overview', async (req, res, next) => {
        res.tkResponse(TKResponse.Success({
            data: {
                income: await sumIncome(req),
                withdraw: await sumWithdraw(req),
                recharge: await sumRecharge(req)
            }
        }))
        next()
    })
}
'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {formatMoney} from "../../common/utils.mjs";

// const sumWallet = async (req, type, fn) => {
//     const records = await req.context.mongo.getWalletRecordWithType(req.headers.id, type)
//     console.log(`records: ${JSON.stringify(records)}`)
//     return records.reduce((prev, curr) => {
//         return prev + fn(curr)
//     }, 0)
// }
//
// const sumIncome = async (req) => {
//     return await sumWallet(req, recordTypeDownLine, (record) => {
//         return record.hasOwnProperty("downLine") && record.downLine.hasOwnProperty("amount") ?
//             record.downLine.amount : 0
//     })
// }
//
// const sumWithdraw = async (req) => {
//     return await sumWallet(req, recordTypeWithdraw, (record) => {
//         return record.hasOwnProperty("withdraw") && record.withdraw.hasOwnProperty("amount") ?
//             record.withdraw.amount : 0
//     })
// }
//
// const sumRecharge = async (req) => {
//     return await sumWallet(req, recordTypeRice, (record) => {
//             return record.hasOwnProperty("rice") && record.rice.hasOwnProperty("price") ?
//                 record.rice.price : 0
//         })
//         +
//         await sumWallet(req, recordTypeMember, (record) => {
//             return record.hasOwnProperty("member") && record.member.hasOwnProperty("price") ?
//                 record.member.price : 0
//         })
// }

export const routeGetWalletOverview = router => {
    router.get('/wallet/overview', async (req, res, next) => {
        const wallet = await req.context.mongo.getWallet(req.headers.id)
        const data = {
            cash: wallet === null ? 0 : wallet.cash,
            rice: wallet === null ? 0 : wallet.rice,
            income: 0,
            withdraw: 0,
            recharge: 0,
            rechargeCount: 0,
        }
        Object.assign(data, wallet === null ? {} : wallet.accumulated)
        data.cash = formatMoney(data.cash)
        data.income = formatMoney(data.income)
        data.recharge = formatMoney(data.recharge)
        data.withdraw = formatMoney(data.withdraw)
        res.tkResponse(TKResponse.Success({data}))
        // res.tkResponse(TKResponse.Success({
        //     data: {
        //         income: await sumIncome(req),
        //         withdraw: await sumWithdraw(req),
        //         recharge: await sumRecharge(req)
        //     }
        // }))
        next()
    })
}
'use strict'

import {InternalError, InvalidArgument} from "../../common/errors/00000-basic.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {NotEnoughCash} from "../../common/errors/40000-payment.mjs";
import {now} from "../../common/utils.mjs";
import {addPaymentRecordWithdrawFreeze} from "../backendRecords.mjs";

const freeze = async (req) => {
    const wallet = await req.context.mongo.getWallet(req.headers.id)
    const cash = wallet !== null && wallet.hasOwnProperty("cash") ? wallet.cash : 0

    if (req.body.amount > cash) {
        throw new NotEnoughCash()
    }

    await req.context.mongo.addCash(req.headers.id, -req.body.amount)
}

const getFee = async (req) => {
    const setting = await req.context.mongo.getFeeSetting()
    if (setting === null) {
        throw new InternalError()
    }

    return Math.floor(req.body.amount / setting.amount) === (req.body.amount / setting.amount) ?
        Math.floor(req.body.amount / setting.amount) * setting.fee :
        (Math.floor(req.body.amount / setting.amount) + 1) * setting.fee
}

const addRecordV1 = async (req, user, fee, amount) => {
    const record = {
        userId: req.headers.id,
        phone: user.phone,
        name: user.identification.name,
        idNo: user.identification.idNo,
        comment: "申请提现",
        amount: amount - fee,
        fee: fee,
        status: false,
        createdAt: now()
    }
    await req.context.mongo.addWalletRecord(record)
}

const addRecordV2 = async (req, user, fee) => {
    const record = {
        status: 0,
        userId: user._id,
        phone: user.phone,
        type: "帐户余额",
        method: "支付宝",
        name: user.identification.name,
        alipayAccount: user.alipayAccount,
        amount: req.body.amount,
        fee: fee,
        createdAt: now()
    }
    await req.context.mongo.addWithdrawRecord(record)
}

const addPaymentRecord = async (req, amount) => {
    await addPaymentRecordWithdrawFreeze(req.context, req.headers.id, amount)
}

export const routeWithdraw = (router) => {
    router.post('/withdraw', async (req, res, next) => {
        // const r = await req.context.stubs.apid.withdraw(req.headers.id, req.body.amount)
        // if (r.isError()) {
        //     throw new InternalError()
        // }

        const amount = Number(req.body.amount)
        if (isNaN(amount)) {
            throw new InvalidArgument()
        }
        req.body.amount = amount

        await freeze(req)

        const fee = await getFee(req)
        console.log(`fee: ${fee}`)

        const userRsp = await req.context.stubs.user.getUser(req.headers.id)
        if (userRsp.isError()) {
            console.log(`get user FAILED!!!, ${req.headers.id}`)
            throw new InternalError()
        }

        const user = userRsp.data
        if (!user.hasOwnProperty("identification")) {
            // throw new HaveNotIdentified()
            // res.tkResponse(TKResponse.fromError(new HaveNotIdentified()))
            res.response({
                status: 200,
                code: -10010,
                msg: "还未实名认证",
                data: {}
            })
            next()
            return
        }
        if (!user.hasOwnProperty("alipayAccount") || user.alipayAccount === "") {
            res.response({status: 200, code: -10011, msg: "未设置支付宝帐号", data: {}})
            next()
            return
        }

        await addRecordV1(req, user, fee, req.body.amount)
        await addRecordV2(req, user, fee)
        await addPaymentRecord(req, req.body.amount)

        res.tkResponse(TKResponse.Success())
        next()
    })
}
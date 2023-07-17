'use strict'

import {InternalError} from "../../common/errors/00000-basic.mjs";
import {HaveNotIdentified} from "../../common/errors/10000-user.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {NotEnoughCash} from "../../common/errors/40000-payment.mjs";
import {now} from "../../common/utils.mjs";

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
}

const addRecordV2 = async (req, user, fee) => {
    const record = {
        status: 0,
        userId: user._id,
        phone: user.phone,
        type: "帐户余额",
        method: "支付宝",
        name: user.identification.name,
        alipayAccount: req.body.alipayAccount,
        amount: req.body.amount,
        fee: fee,
        createdAt: now()
    }
    await req.context.mongo.addWithdrawRecord(record)
}

export const routeWithdraw = (router) => {
    router.post('/withdraw', async (req, res, next) => {
        // const r = await req.context.stubs.apid.withdraw(req.headers.id, req.body.amount)
        // if (r.isError()) {
        //     throw new InternalError()
        // }

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
            throw new HaveNotIdentified()
        }

        await addRecordV1(req, user, fee, req.body.amount)
        await addRecordV2(req, user, fee)

        res.tkResponse(TKResponse.Success())
        next()
    })
}
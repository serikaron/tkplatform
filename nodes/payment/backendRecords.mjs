'use strict'

import {ObjectId} from "mongodb";
import {now} from "../common/utils.mjs";
import {UserNotExists} from "../common/errors/10000-user.mjs";

const fillUserFiled = async (context, record, userId) => {
    const userRsp = await context.stubs.user.getUser(userId)
    if (userRsp.isError()) {
        throw new UserNotExists()
    }

    record.userId = new ObjectId(userId)
    record.phone = userRsp.data.phone
}

/**
 * paymentRecord
 * _id: string - order id
 * userId: ObjectId
 * phone: string - user phone
 * type: int - 1:income 2:outcome
 * category: int 1：购买会员，2：管理员减少...
 * categoryDescription: string
 * income: int
 * outcome: int
 * balance: int
 * createdAt: timestamp
 * contributor: string - contributor phone
 * remark: string
 */

const paymentRecordType = {income: 1, outcome: 2}

const paymentRecordCategory = {
    member: {category: 0, desc: "购买会员"},
    commission: {category: 1, desc: "下级提成奖励"}
}

export const addPaymentRecord = async (context, userId, fillFn) => {
    const record = {}
    await fillUserFiled(context, record, userId)
    record.createdAt = now()
    Object.assign(record, await fillFn(record))
    // console.log(`addPaymentRecord: ${JSON.stringify(record)}`)
    await context.mongo.addPaymentRecord(record)
}

export const addPaymentRecordMember = async (context, userId, amount) => {
    const wallet = context.mongo.getWallet(userId)
    const balance = wallet !== null && wallet.hasOwnProperty("cash") ?
        wallet.cash : 0
    await addPaymentRecord(context, userId, (record) => {
        return {
            type: paymentRecordType.outcome,
            outcome: amount,
            category: paymentRecordCategory.member.category,
            categoryDescription: paymentRecordCategory.member.desc,
            remark: `${record.phone}购买会员`,
            balance: balance
        }
    })
}

export const addPaymentRecordCommission = async (context, userId, amount, level, contributor) => {
    const wallet = await context.mongo.getWallet(userId)
    const balance = wallet !== null && wallet.hasOwnProperty("cash") ?
        wallet.cash : 0
    // console.log(`addPaymentRecordCommission, userId: ${userId}, wallet: ${JSON.stringify(wallet)}`)
    const remark = (level) => {
        switch (level) {
            case 1: return `${contributor}购买会员提成一级奖励`
            case 2: return `${contributor}购买会员提成二级奖励`
            case 3: return `${contributor}购买会员提成三级奖励`
            default: return ""
        }
    }
    await addPaymentRecord(context, userId, (record) => {
        return {
            type: paymentRecordType.income,
            income: amount,
            category: paymentRecordCategory.commission.category,
            categoryDescription: paymentRecordCategory.commission.desc,
            remark: remark(level),
            balance: balance,
            contributor: contributor
        }
    })
}
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

const recordType = {income: 1, outcome: 2}

const recordCategory = {
    member: {category: 0, desc: "购买会员"},
    commission: {category: 1, desc: "下级提成奖励"},
    rice: {category: 2, desc: "购买米粒"}
}

/**
 * 资金明细
 * paymentRecord
 * _id: string - order id
 * userId: ObjectId
 * phone: string - user phone
 * type: recordType
 * category: recordCategory
 * categoryDescription: string
 * income: int
 * outcome: int
 * balance: int
 * createdAt: timestamp
 * contributor: string - contributor phone
 * remark: string
 */

const addPaymentRecord = async (context, userId, fillFn) => {
    const record = {}
    await fillUserFiled(context, record, userId)
    record.createdAt = now()
    Object.assign(record, await fillFn(record))
    // console.log(`addPaymentRecord: ${JSON.stringify(record)}`)
    await context.mongo.addPaymentRecord(record)
}

export const addPaymentRecordMember = async (context, userId, amount) => {
    const wallet = await context.mongo.getWallet(userId)
    const balance = wallet !== null && wallet.hasOwnProperty("cash") ?
        wallet.cash : 0
    await addPaymentRecord(context, userId, (record) => {
        return {
            type: recordType.outcome,
            outcome: amount,
            category: recordCategory.member.category,
            categoryDescription: recordCategory.member.desc,
            remark: `${record.phone}${recordCategory.member.desc}`,
            balance: balance
        }
    })
}

const addPaymentRecordCommission = async (context, userId, amount, level, contributor, payRecordCategory) => {
    const wallet = await context.mongo.getWallet(userId)
    const balance = wallet !== null && wallet.hasOwnProperty("cash") ?
        wallet.cash : 0
    // console.log(`addPaymentRecordCommission, userId: ${userId}, wallet: ${JSON.stringify(wallet)}`)
    const remark = (level, category) => {
        switch (level) {
            case 1: return `${contributor}${category.desc}提成一级奖励`
            case 2: return `${contributor}${category.desc}提成二级奖励`
            case 3: return `${contributor}${category.desc}提成三级奖励`
            default: return ""
        }
    }
    await addPaymentRecord(context, userId, (record) => {
        return {
            type: recordType.income,
            income: amount,
            category: recordCategory.commission.category,
            categoryDescription: recordCategory.commission.desc,
            remark: remark(level, payRecordCategory),
            balance: balance,
            contributor: contributor
        }
    })
}

export const addPaymentRecordCommissionMember = async (context, userId, amount, level, contributor) => {
    await addPaymentRecordCommission(context, userId, amount, level, contributor, recordCategory.member)
}

export const addPaymentRecordCommissionRice = async (context, userId, amount, level, contributor) => {
    await addPaymentRecordCommission(context, userId, amount, level, contributor, recordCategory.rice)
}

export const addPaymentRecordRice = async (context, userId, amount) => {
    const wallet = await context.mongo.getWallet(userId)
    const balance = wallet !== null && wallet.hasOwnProperty("cash") ?
        wallet.cash : 0
    await addPaymentRecord(context, userId, (record) => {
        return {
            type: recordType.outcome,
            outcome: amount,
            category: recordCategory.rice.category,
            categoryDescription: recordCategory.rice.desc,
            remark: `${record.phone}购买米粒`,
            balance: balance
        }
    })
}

/**
 * 米粒明细
 * riceRecord
 * _id: string - order id
 * userId: ObjectId
 * phone: string - user phone
 * type: recordType
 * category: recordCategory
 * categoryDescription: string
 * income: int
 * outcome: int
 * balance: int
 * createdAt: timestamp
 * remark: string
 */

const addRiceRecord = async (context, userId, fillFn) => {
    const record = {}
    await fillUserFiled(context, record, userId)
    record.createdAt = now()
    Object.assign(record, await fillFn(record))
    console.log(`addRiceRecord: ${JSON.stringify(record)}`)
    await context.mongo.addRiceRecord(record)
}

export const addRiceRecordRice = async (context, userId, rice) => {
    const wallet = await context.mongo.getWallet(userId)
    const balance = wallet !== null && wallet.hasOwnProperty("rice") ?
        wallet.rice : 0
    await addRiceRecord(context, userId, (record) => {
        return {
            type: recordType.income,
            income: rice,
            category: recordCategory.rice.category,
            categoryDescription: recordCategory.rice.desc,
            remark: `${record.phone}购买米粒`,
            balance: balance
        }
    })
}

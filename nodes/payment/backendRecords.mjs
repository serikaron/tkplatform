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
 * db: paymentRecords
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
            case 1:
                return `${contributor}${category.desc}提成一级奖励`
            case 2:
                return `${contributor}${category.desc}提成二级奖励`
            case 3:
                return `${contributor}${category.desc}提成三级奖励`
            default:
                return ""
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
 * db: riceRecords
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

/**
 * 会员明细
 * db: memberRecords
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

const addMemberRecord = async (context, userId, fillFn) => {
    const record = {}
    await fillUserFiled(context, record, userId)
    record.createdAt = now()
    Object.assign(record, await fillFn(record))
    await context.mongo.addMemberRecord(record)
}

export const addMemberRecordMember = async (context, userId, days) => {
    const userRsp = await context.stubs.user.getUser(userId)
    if (userRsp.isError()) {
        throw new UserNotExists()
    }
    await addMemberRecord(context, userId, (record) => {
        return {
            type: recordType.income,
            income: days,
            category: recordCategory.member.category,
            categoryDescription: recordCategory.member.desc,
            remark: `${record.phone}${recordCategory.member.desc}`,
            balance: userRsp.data.member.expiration
        }
    })
}

/**
 * 提现明细
 * db: withdrawRecords
 * _id: string - order id
 * status: 0-待处理，1-处理中，2-已审核，3-已驳回
 * userId: ObjectId
 * phone: string - user phone
 * type: 出款类型 - 帐户余额 （写死）
 * method: 提现方式 - 支付宝 （写死）
 * name: string
 * alipayAccount: string
 * amount: number
 * fee: number
 * createdAt: timestamp
 * remark: string
 */

'use strict'

import {ObjectId} from "mongodb";
import {now} from "../common/utils.mjs";
import {UserNotExists} from "../common/errors/10000-user.mjs";
import {recordCategory, recordType} from "../common/backendRecords.mjs";

const fillUserFiled = async (context, record, userId) => {
    const userRsp = await context.stubs.user.getUser(userId)
    if (userRsp.isError()) {
        throw new UserNotExists()
    }

    record.userId = new ObjectId(userId)
    record.phone = userRsp.data.phone
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

const addPaymentRecordWithdraw = async (context, userId, fn) => {
    const wallet = await context.mongo.getWallet(userId)
    const balance = isNaN(Number(wallet.cash)) ? 0 : Number(wallet.cash)
    // console.log(`wallet: ${JSON.stringify(wallet)}, balance: ${balance}`)
    await addPaymentRecord(context, userId, (record) => {
        return Object.assign(fn(record), {balance})
    })
}

export const addPaymentRecordWithdrawFreeze = async (context, userId, amount) => {
    await addPaymentRecordWithdraw(context, userId, (record) => {
        return {
            type: recordType.outcome,
            outcome: amount,
            category: recordCategory.withdrawFreeze.category,
            categoryDescription: recordCategory.withdrawFreeze.desc,
            remark: "申请提现，冻结金额",
        }
    })
}

export const addPaymentRecordWithdrawUnfreeze = async (context, userId, amount) => {
    await addPaymentRecordWithdraw(context, userId, (record) => {
        return {
            type: recordType.income,
            income: amount,
            category: recordCategory.withdrawUnfreeze.category,
            categoryDescription: recordCategory.withdrawUnfreeze.desc,
            remark: "提现失败，解冻金额",
        }
    })
}

export const addPaymentRecordWithdrawDone = async (context, userId, amount) => {
    await addPaymentRecordWithdraw(context, userId, (record) => {
        return {
            type: recordType.outcome,
            outcome: amount,
            category: recordCategory.withdrawDone.category,
            categoryDescription: recordCategory.withdrawDone.desc,
            remark: "提现成功，扣款金额",
        }
    })
}

export const addPaymentRecordAdmin = async (context, userId, amount) => {
    const wallet = await context.mongo.getWallet(userId)
    const balance = wallet !== null && wallet.hasOwnProperty("cash") ?
        wallet.cash : 0
    await addPaymentRecord(context, userId, (record) => {
        return amount > 0 ? {
            type: recordType.income,
            income: amount,
            category: recordCategory.adminAdd.category,
            categoryDescription: recordCategory.adminAdd.desc,
            balance: balance,
            remark: "管理员手动操作资金"
        } : {
            type: recordType.outcome,
            outcome: -amount,
            category: recordCategory.adminSub.category,
            categoryDescription: recordCategory.adminSub.desc,
            balance: balance,
            remark: "管理员手动操作资金"
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

    const wallet = await context.mongo.getWallet(userId)
    record.balance = wallet !== null && wallet.hasOwnProperty("rice") ? wallet.rice : 0

    record.createdAt = now()
    Object.assign(record, await fillFn(record))
    await context.mongo.addRiceRecord(record)
}

export const addRiceRecordRice = async (context, userId, rice) => {
    await addRiceRecord(context, userId, (record) => {
        return {
            type: recordType.income,
            income: rice,
            category: recordCategory.rice.category,
            categoryDescription: recordCategory.rice.desc,
            remark: `${record.phone}购买米粒`,
        }
    })
}

export const addRiceRecordAdmin = async (context, userId, rice) => {
    await addRiceRecord(context, userId, (record) => {
        return rice > 0 ? {
            type: recordType.income,
            income: rice,
            category: recordCategory.adminAdd.category,
            categoryDescription: recordCategory.adminAdd.desc,
            remark: "管理员手动操作",
        } : {
            type: recordType.outcome,
            outcome: -rice,
            category: recordCategory.adminSub.category,
            categoryDescription: recordCategory.adminSub.desc,
            remark: "管理员手动操作",
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

export const withdrawRecordStatus = {
    pending: 0,
    processing: 1,
    approved: 2,
    rejected: 3
}
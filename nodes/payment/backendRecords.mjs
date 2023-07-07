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
}

export const addPaymentRecord = async (context, userId, fillFn) => {
    const record = {}
    await fillUserFiled(context, record, userId)
    record.createdAt = now()
    Object.assign(record, await fillFn(record))
    await context.mongo.addPaymentRecord(record)
}

export const addPaymentRecordMember = async (context, userId, amount) => {
    await addPaymentRecord(context, userId, (record) => {
        return {
            type: paymentRecordType.outcome,
            outcome: amount,
            category: paymentRecordCategory.member.category,
            categoryDescription: paymentRecordCategory.member.desc,
            remark: `${record.phone}购买会员`
        }
    })
}
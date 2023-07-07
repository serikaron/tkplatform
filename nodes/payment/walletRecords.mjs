'use strict'
import {InternalError} from "../common/errors/00000-basic.mjs";
import {recordTypeMember, recordTypeRice} from "./itemType.mjs";

const buildWalletRecord = async (req, log, recordSubItemBuilder) => {
    const userRsp = await req.context.stubs.user.getUser(log.userId)
    if (userRsp.isError()) {
        throw new InternalError()
    }

    const user = userRsp.data
    const record = {
        userId: log.userId.toString(),
        phone: user.phone,
        idNo: user.identity,
        name: user.name,
    }

    await recordSubItemBuilder(record, req, log)

    return record
}
export const memberRecordBuilder = async (record, req, log) => {
    record.type = recordTypeMember
    const priceNum = isNaN(Number(log.amount)) ? 0 : Number(log.amount) * 100
    record.member = {
        title: log.item.title,
        price: priceNum,
        remainDays: log.days,
    }
}
export const riceRecordBuilder = async (record, req, log) => {
    record.type = recordTypeRice
    const priceNum = isNaN(Number(log.amount)) ? 0 : Number(log.amount) * 100
    record.rice = {
        title: log.item.title,
        price: priceNum,
        remainDays: log.days,
    }
}
export const addWalletRecord = async (req, log, builder) => {
    const record = await buildWalletRecord(req, log, builder)
    console.log(`addMemberRecord: ${JSON.stringify(record)}`)
    await req.context.mongo.addWalletRecord(record)
}
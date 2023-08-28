'use strict'

import {formatMoney, getValueNumber, getValueString, replaceId} from "../../common/utils.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

const mapPaymentRecord = (item) => {
    const out = {
        id: item._id,
        createdAt: item.createdAt,
        category: item.categoryDescription,
        phone: item.phone,
        type: item.type,
        remark: item.remark
    }
    if (item.hasOwnProperty("income")) {
        out.income = formatMoney(item.income)
    }
    if (item.hasOwnProperty("outcome")) {
        out.outcome = formatMoney(item.outcome)
    }
    if (item.hasOwnProperty("balance")) {
        out.balance = formatMoney(item.balance)
    }
    if (item.hasOwnProperty("contributor")) {
        out.contributor = item.contributor
    }
    return out
}

const mapRiceRecord = (item) => {
    const out = {
        id: item._id,
        createdAt: item.createdAt,
        category: item.categoryDescription,
        phone: item.phone,
        type: item.type,
        remark: item.remark
    }
    if (item.hasOwnProperty("income")) {
        out.income = item.income
    }
    if (item.hasOwnProperty("outcome")) {
        out.outcome = item.outcome
    }
    if (item.hasOwnProperty("balance")) {
        out.balance = item.balance
    }
    return out
}

const mapMemberRecord = (item) => {
    return mapRiceRecord(item)
}

const mapWithdrawRecord = (item) => {
    replaceId(item)
    item.netAmount = formatMoney(item.amount - item.fee)
    item.amount = formatMoney(item.amount)
    item.fee = formatMoney(item.fee)
    delete item.userId
    return item
}


const makeHandler = (collectionName, mapFn) => {
    return async (req, res, next) => {
        const offset = getValueNumber(req.query, "offset", 0)
        const limit = getValueNumber(req.query, "limit", 50)

        const filter = {}
        const makeFilter = () => {
            const plugStringFilter = (field) => {
                const v = getValueString(req.query, field, "")
                if (v !== "") {
                    filter[field] = v
                }
            }

            const plugNumberFilter = (field) => {
                const v = getValueNumber(req.query, field, 0)
                if (v !== 0) {
                    filter[field] = v
                }
            }
            plugStringFilter("phone")
            plugStringFilter("id")
            plugNumberFilter("status")
            plugNumberFilter("startTime")
            plugNumberFilter("endTime")
            plugNumberFilter("type")
        }
        makeFilter()

        // console.log(`filter: ${JSON.stringify(filter)}`)

        const r = await req.context.mongo.getRecords(collectionName, offset, limit, filter)
        // console.log(`get records: ${JSON.stringify(r)}`)

        res.tkResponse(TKResponse.Success({
            data: {
                total: r.count,
                items: r.items.map(mapFn),
                offset, limit
            }
        }))
        next()
    }
}


export const routeGetRecords = (router) => {
    router.get("/payment/records", makeHandler("paymentRecords", mapPaymentRecord))
    router.get("/rice/records", makeHandler("riceRecords", mapRiceRecord))
    router.get('/member/records', makeHandler("memberRecords", mapMemberRecord))
    router.get('/withdraw/records', makeHandler('withdrawRecords', mapWithdrawRecord))
}
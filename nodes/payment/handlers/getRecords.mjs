'use strict'

import {formatMoney, getValueNumber, getValueString, replaceId} from "../../common/utils.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

const getPaymentRecordsBackend = async (req, res, next) => {
    const offset = getValueNumber(req.query, "offset", 0)
    const limit = getValueNumber(req.query, "limit", 50)
    const phone = getValueString(req.query, "phone", null)
    const id = getValueString(req.query, "id", null)
    const r = await req.context.mongo.getPaymentRecords(offset, limit, {phone, id})

    const mapItem = (item) => {
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
    res.tkResponse(TKResponse.Success({
        data: {
            total: r.count,
            items: r.items.map(mapItem),
            offset, limit
        }
    }))
    next()
}

export const routeGetRecords = (router) => {
    router.get("/payment/records", getPaymentRecordsBackend)
}
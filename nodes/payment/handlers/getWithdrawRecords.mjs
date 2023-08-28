'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {getValueNumber} from "../../common/utils.mjs";

export const routeGetWithdrawRecords = router => {
    router.get('/wallet/withdraw/records', async (req, res, next) => {
        const offset = getValueNumber(req.query, "offset", 0)
        const limit = getValueNumber(req.query, "limit", 50)

        const l = await req.context.mongo.getRecords("withdrawRecords", offset, limit, {})
        // console.log(`withdraw records: ${JSON.stringify(l)}`)

        const items = l.items.map(x => {
            return {
                createdAt: x.createdAt,
                amount: x.amount,
                fee: x.fee,
                comment: x.remark,
                status: x.status === 2
            }
        })

        res.tkResponse(TKResponse.Success({
            data: {
                total: {
                    count: 0,
                    amount: 0,
                },
                items
            }
        }))
        next()
    })
}
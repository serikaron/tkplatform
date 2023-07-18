'use strict'

import {InvalidArgument, NotFound} from "../../common/errors/00000-basic.mjs";
import {
    addPaymentRecordWithdrawDone,
    addPaymentRecordWithdrawUnfreeze,
    withdrawRecordStatus
} from "../backendRecords.mjs";
import {addCash} from "../../tests/integration/backend.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {now} from "../../common/utils.mjs";


const checkStatus = (inputStatus, recordStatus) => {
    switch (recordStatus) {
        case withdrawRecordStatus.pending:
            return inputStatus === withdrawRecordStatus.processing
        case withdrawRecordStatus.processing:
            return inputStatus === withdrawRecordStatus.approved ||
                inputStatus === withdrawRecordStatus.rejected
        default:
            return false
    }
}

const auditedAt = (inputStatus) => {
    switch (inputStatus) {
        case withdrawRecordStatus.approved:
            return now()
        case withdrawRecordStatus.rejected:
            return now()
        default:
            return null
    }
}

export const routeAuditWithdrawal = (router) => {
    router.put("/withdraw/record/:recordId", async (req, res, next) => {
        const record = await req.context.mongo.getWithdrawRecord(req.params.recordId)
        if (record === null) {
            throw new NotFound()
        }

        if (!checkStatus(req.body.status, record.status)) {
            console.log(`audit withdrawal, invalid input status ${req.body.status} for record ${JSON.stringify(record)}`)
            throw new InvalidArgument()
        }
        console.log('status ok')

        await req.context.mongo.updateWithdrawRecord(req.params.recordId, req.body.status, req.body.remark, auditedAt(req.body.status))
        console.log('record updated')

        if (req.body.status === withdrawRecordStatus.approved) {
            console.log('approve')
            await addPaymentRecordWithdrawDone(req.context, record.userId, record.amount)
        }

        console.log('audit')

        if (req.body.status === withdrawRecordStatus.rejected) {
            console.log('reject')
            await req.context.mongo.addCash(record.userId, record.amount)
            console.log('cash added')
            await addPaymentRecordWithdrawUnfreeze(req.context, record.userId, record.amount)
            console.log('unfreeze')
        }

        console.log('all done')

        res.tkResponse(TKResponse.Success())
        next()
    })
}
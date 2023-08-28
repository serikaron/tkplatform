'use strict'

import {InvalidArgument, NotFound} from "../../common/errors/00000-basic.mjs";
import {
    addPaymentRecordWithdrawDone,
    addPaymentRecordWithdrawUnfreeze,
    withdrawRecordStatus
} from "../backendRecords.mjs";
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

const auditWithdrawal = async (req, recordId, status, remark) => {
    const record = await req.context.mongo.getWithdrawRecord(recordId)
    if (record === null) {
        throw new NotFound()
    }

    if (!checkStatus(status, record.status)) {
        console.log(`audit withdrawal, invalid input status ${req.body.status} for record ${JSON.stringify(record)}`)
        throw new InvalidArgument()
    }

    await req.context.mongo.updateWithdrawRecord(recordId, status, remark, auditedAt(status))

    console.log(`audit record: ${JSON.stringify(record)}`)

    if (req.body.status === withdrawRecordStatus.approved) {
        await req.context.mongo.incWithdraw(record.userId, record.amount)
        await addPaymentRecordWithdrawDone(req.context, record.userId, record.amount)
    }

    if (req.body.status === withdrawRecordStatus.rejected) {
        await req.context.mongo.addCash(record.userId, record.amount)
        await addPaymentRecordWithdrawUnfreeze(req.context, record.userId, record.amount)
    }
}

export const routeAuditWithdrawal = (router) => {
    router.put("/withdraw/record/:recordId", async (req, res, next) => {
        await auditWithdrawal(req, req.params.recordId, req.body.status, req.body.remark)

        res.tkResponse(TKResponse.Success())
        next()
    })

    router.put("/withdraw/records", async (req, res, next) => {
        for (const recordId of req.body.ids) {
            await auditWithdrawal(req, recordId, req.body.status, req.body.remark)
        }

        res.tkResponse(TKResponse.Success())
        next()
    })
}
'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {recordCategory, recordType} from "../../common/backendRecords.mjs";
import {now} from "../../common/utils.mjs";
import {InvalidArgument} from "../../common/errors/00000-basic.mjs";
import {UserNotExists} from "../../common/errors/10000-user.mjs";

const makeBackendRecord = async (req, days) => {
    const user = await req.context.mongo.getUserById(req.body.userId)

    return Object.assign({
        userId: req.body.userId,
        phone: user.phone,
        remark: "管理员手动操作",
        balance: user.member.expiration,
        createdAt: now()
    }, days >= 0 ? {
        type: recordType.income,
        income: days,
        category: recordCategory.adminAdd.category,
        categoryDescription: recordCategory.adminAdd.desc,
    } : {
        type: recordType.outcome,
        outcome: -days,
        category: recordCategory.adminSub.category,
        categoryDescription: recordCategory.adminSub.desc,
    })
}
export const routeAddUserMember = (router) => {
    router.post('/user/member', async (req, res, next) => {
        const days = Number(req.body.days)
        if (isNaN(days)) {
            throw new InvalidArgument()
        }

        const user = await req.context.mongo.getUserById(req.body.userId)
        if (user === null) {
            throw new UserNotExists()
        }

        if (user.member.expiration <= now()) {
            await req.context.mongo.setUserMember(req.body.userId, now() + days * 86400)
        } else {
            await req.context.mongo.addUserMember(req.body.userId, days)
        }


        res.tkResponse(TKResponse.Success())
        next()
    })

    router.post('/backend/user/member', async (req, res, next) => {
        const days = Number(req.body.days)
        if (isNaN(days)) {
            throw new InvalidArgument()
        }

        await req.context.mongo.addUserMember(req.body.userId, days)

        const record = await makeBackendRecord(req, days)
        await req.context.stubs.payment.addBackendRecord(record)
        res.tkResponse(TKResponse.Success())
        next()
    })
}
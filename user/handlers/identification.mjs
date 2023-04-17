'use strict'

import {InternalError} from "../../common/errors/00000-basic.mjs";
import {AlreadyIdentified, IdentifyFailed} from "../../common/errors/10000-user.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

export const routeIdentification = router => {
    router.post('/user/identification', async (req, res, next) => {
        const u = await req.context.mongo.getUserById(req.headers.id)
        if (u === null) {
            throw new InternalError()
        }

        if (u.hasOwnProperty("identification")) {
            throw new AlreadyIdentified()
        }

        const r = (req.body.force === true) ? {
                respCode: "0000",
                idNo: req.body.idNo,
                name: req.body.name
            } : await req.context.aliyun.identify(process.env.ALIYUN_APP_CODE, req.body.idNo, req.body.name)
        console.log(`identify result ${r}`)
        if (r.respCode !== "0000") {
            throw new IdentifyFailed()
        }

        // const r = await req.context.aliyun.identify(process.env.ALIYUN_APP_CODE, req.body.idNo, req.body.name)
        // console.log(`identify result ${r}`)
        // if (r.respCode !== "0000") {
        //     throw new IdentifyFailed()
        // }

        const update = {
            identification: {
                idNo: r.idNo,
                name: r.name,
                image: req.body.image
            },
        }
        if (req.body.hasOwnProperty("wechat")) {
            update["contact.wechat.account"] = req.body.wechat
        }
        if (req.body.hasOwnProperty("qq")) {
            update["contact.qq.account"] = req.body.qq
        }
        await req.context.mongo.updateIdentification(req.headers.id, update)

        res.tkResponse(TKResponse.Success())

        next()
    })
}
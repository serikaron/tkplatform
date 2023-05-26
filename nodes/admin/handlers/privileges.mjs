'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";

export const routePrivileges = (router) => {
    router.put("/admin/:adminId/privileges", async (req, res, next) => {
        await req.context.mongo.setPrivileges(req.params.adminId, req.body.privileges)
        res.tkResponse(TKResponse.Success())
        next()
    })

    router.get("/admin/:adminId/privileges", async (req, res, next) => {
        const p = await req.context.mongo.getPrivileges(req.params.adminId)
        res.tkResponse(TKResponse.Success({
            data: p !== null && p.hasOwnProperty("privileges") ? p.privileges : []
        }))
        next()
    })

    router.get("/admins/privileges", async (req, res, next) => {
        const p = await req.context.mongo.getAllPrivileges()
        res.tkResponse(TKResponse.Success({
            data: p
        }))
        next()
    })
}
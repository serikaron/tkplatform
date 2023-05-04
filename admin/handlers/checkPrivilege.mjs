'use strict'

import {privilegeSettings} from "../privileges.mjs";
import {Forbidden} from "../../common/errors/00000-basic.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {base64Decode} from "../../common/utils.mjs";

const getPrivilege = (req) => {
    for (const setting of Object.keys(privilegeSettings)) {
        const method = setting.method
        if (method.toUpperCase() !== req.params.method.toUpperCase()) {
            console.log(`method not match: ${l1[0]} - ${req.params.method}`)
            continue
        }

        const pathSetup = setting.url.split("/")
        const pathInput = decodeURIComponent(req.params.path).split("?")[0].split("/")
        console.log(`pathSetup:${pathSetup}, pathInput:${pathInput}`)

        if (pathSetup.length !== pathInput.length) {
            continue
        }

        let match = true
        for (let i = 0; i < pathInput.length; ++i) {
            if (pathInput[i] === pathSetup[i]) {
                continue
            }

            if (pathSetup[i][0] === ":") {
                continue
            }

            match = false
            break
        }

        if (match) return setting.privilege
    }

    return null
}
export const routeCheckPrivileges = (router) => {
    router.get("/privilege/:method/:path", async (req, res, next) => {
        const requirePrivilege = getPrivilege(req)
        if (requirePrivilege === null) {
            console.log("privilege not found")
            throw new Forbidden()
        }

        const p = await req.context.mongo.getPrivileges(req.headers.id)

        if (!p.privileges.includes(requirePrivilege)) {
            throw new Forbidden()
        }

        res.tkResponse(TKResponse.Success())
        next()
    })
}

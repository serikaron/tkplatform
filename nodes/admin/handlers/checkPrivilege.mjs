'use strict'

import {privilegeSettings} from "../privileges.mjs";
import {Forbidden} from "../../common/errors/00000-basic.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

const getPrivilege = (req) => {
    console.log(`get privilege, req.method:${req.params.method}, req.url:${decodeURIComponent(req.params.path)}`)

    for (const setting of privilegeSettings) {
        // console.log(`setting: ${JSON.stringify(setting)}`)
        const method = setting.method
        // console.log(`setting.method:${setting.method}, req.method:${req.params.method}`)
        if (method.toUpperCase() !== req.params.method.toUpperCase()) {
            // console.log(`method not match: ${method} - ${req.params.method}`)
            continue
        }

        const pathSetup = setting.url.split("/")
        const pathInput = decodeURIComponent(req.params.path).split("?")[0].split("/")
        // console.log(`pathSetup:${pathSetup}, pathInput:${pathInput}`)

        if (pathSetup.length !== pathInput.length) {
            continue
        }

        let match = true
        for (let i = 0; i < pathInput.length; ++i) {
            // console.log(`setup:${pathSetup[i]}, input:${pathInput}`)
            if (pathInput[i] === pathSetup[i]) {
                continue
            }

            // console.log(`setup: ${pathSetup[i]}, s:${pathSetup[i][0]}, match:${pathSetup[i][0] === ":"}`)
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
            console.log("privilege not match")
            throw new Forbidden()
        }

        res.tkResponse(TKResponse.Success())
        next()
    })
}

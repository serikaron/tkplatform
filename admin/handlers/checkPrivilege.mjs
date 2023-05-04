'use strict'

import {privilegeMap} from "../privileges.mjs";
import {Forbidden} from "../../common/errors/00000-basic.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {base64Decode} from "../../common/utils.mjs";

const getKey = (req) => {
    for (const key of Object.keys(privilegeMap)) {
        const l1 = key.split("-")
        if (l1[0].toUpperCase() !== req.params.method.toUpperCase()) {
            console.log(`method not match: ${l1[0]} - ${req.params.method}`)
            continue
        }

        const pathSetup = l1[1].split("/")
        const pathInput = base64Decode(req.params.path).split("/")
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

        if (match) return key
    }

    return null
}
export const routeCheckPrivileges = (router) => {
    router.get("/privilege/:method/:path", async (req, res, next) => {
        const key = getKey(req)
        if (key === null) {
            console.log("key not found")
            throw new Forbidden()
        }

        const requirePrivilege = privilegeMap[key]

        if (requirePrivilege === undefined) {
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

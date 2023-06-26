'use strict'

import {InternalError} from "../../common/errors/00000-basic.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {makeMiddleware} from "../../common/flow.mjs";

const checkDownLine = async (req) => {
    const user = await req.context.mongo.getUserById(req.headers.id)
    if (user === null) {
        throw new InternalError()
    }

    if (!user.hasOwnProperty("downLines")) {
        throw new InternalError()
    }

    const l = user.downLines
        .filter(x => x.id.toString() === req.params.downLine)
    if (l === undefined || l.length !== 1) {
        throw new InternalError()
    }

    if (l[0].hasOwnProperty("claimed") && l[0].claimed) {
        throw new InternalError()
    }
}

const getConfig = async (req) => {
    const configRsp = await req.context.stubs.system.settings.get("claimDownLinePrice")
    if (configRsp.isError()) {
        throw new InternalError()
    }

    const price = Number(configRsp.data)
    req.price = isNaN(price) ? 10 : price
}

const updateClaimed = async (req) => {
    await req.context.mongo.updateClaimed(req.headers.id, req.params.downLine)
}

const updateWallet = async (req) => {
    const r = await req.context.stubs.payment.updateWallet(req.headers.id, {invitePoint: req.price})
    if (r.isError()) {
        console.log(`ERROR, updateWallet, ${r.msg}`)
        throw new InternalError()
    }
}

const send = async (req, res) => {
    res.tkResponse(TKResponse.Success())
}

export const routeClaimDownLinePrice = router => {
    router.post('/user/downLine/:downLine/claim', makeMiddleware([
        checkDownLine,
        getConfig,
        updateClaimed,
        updateWallet,
        send
    ]))
}
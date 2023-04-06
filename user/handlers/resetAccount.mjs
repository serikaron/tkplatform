'use strict'

import {isBadFieldString, isBadFieldObject, isBadPhone} from "../../common/utils.mjs";
import {InvalidArgument, Unauthorized} from "../../common/errors/00000-basic.mjs";
import {makeMiddleware} from "../../common/flow.mjs";
import {ResetAccountFailed, UserNotExists, VerifySmsCodeFailed} from "../../common/errors/10000-user.mjs";
import {tokenPayload} from "../stubs.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

const hasBeenLogin = (req) => {
    return req.headers.id !== undefined
}

function checkInput(req) {
    if (
        isBadFieldObject(req.body.old)
        || isBadFieldObject(req.body.new)
        || isBadFieldString(req.body.new.phone)
        || isBadPhone(req.body.new.phone)
        || isBadFieldString(req.body.new.smsCode)
    ) {
        throw new InvalidArgument()
    }

    if (hasBeenLogin(req)) {
        if (isBadFieldString(req.body.old.smsCode)) {
            throw new InvalidArgument()
        }
    } else {
        if (isBadFieldString(req.body.old.phone)
            || isBadFieldString(req.body.old.password)
            || isBadPhone(req.body.old.phone)) {
            throw new InvalidArgument()
        }
    }
}

async function checkUser(req) {
    const user = await req.context.mongo.getPassword({userId: req.headers.id, phone: req.body.old.phone})

    if (user === null) {
        throw new UserNotExists()
    }

    if (!hasBeenLogin(req)) {
        const match = await req.context.password.verify(user.password, req.body.old.password)
        if (!match) {
            throw new ResetAccountFailed()
        }
    }

    req.user = user
}

async function checkCode(req) {
    const response = await req.context.stubs.sms.verify(req.body.new.phone, req.body.new.smsCode)
    if (response.isError()) {
        throw new VerifySmsCodeFailed()
    }

    if (req.headers.id !== undefined) {
        const response = await req.context.stubs.sms.verify(req.user.phone, req.body.old.smsCode)
        if (response.isError()) {
            throw new VerifySmsCodeFailed()
        }
    }
}

async function updateDb(req) {
    await req.context.mongo.updateAccount(req.user._id, req.body.new.phone)
}

async function genToken(req) {
    if (hasBeenLogin(req)) {
        const response = await req.context.stubs.token.gen(tokenPayload(`${req.user._id}`, req.body.new.phone))
        if (response.isError()) {
            throw new Unauthorized()
        }
        req.responseData = response.data
    } else {
        req.responseData = {}
    }
}

async function onSuccess(req, res) {
    res.tkResponse(TKResponse.Success({
        data: req.responseData
    }))
}

export function route(router) {
    router.post("/user/account", ...makeMiddleware([
        checkInput,
        checkUser,
        checkCode,
        updateDb,
        genToken,
        onSuccess,
    ]))
}

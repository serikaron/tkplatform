'use strict'

import {isBadFieldString} from "../../common/utils.mjs";
import {InvalidArgument} from "../../common/errors/00000-basic.mjs";
import {makeMiddleware} from "../../common/flow.mjs";
import {UserNotExists, VerifySmsCodeFailed} from "../../common/errors/10000-user.mjs";
import {tokenPayload} from "../stubs.mjs";

function checkInput(req) {
    if (isBadFieldString(req.body.smsCode) || isBadFieldString(req.body.newPassword)) {
        throw new InvalidArgument()
    }
}

async function checkUser(req) {
    console.log(`checkUser, headers:${JSON.stringify(req.headers)}`)
    const user = await req.context.mongo.getUserById(req.headers.id)
    if (user === null) {
        throw new UserNotExists()
    }
    if (user.phone !== req.headers.phone) {
        throw new InvalidArgument()
    }
}

async function checkSms(req) {
    const response = await req.context.stubs.sms.verify(req.headers.phone, req.body.smsCode)
    if (response.isError()) {
        throw new VerifySmsCodeFailed()
    }
}

async function reset(req) {
    const encodedPassword = await req.context.password.encode(req.body.newPassword)
    await req.context.mongo.updatePassword(req.headers.id, encodedPassword)
}

async function genToken(req, res) {
    const response = await req.context.stubs.token.gen(tokenPayload(req.headers.id, req.headers.phone))
    if (response.isError()) {
        res.response({
            status: 200, code: 0, msg: "更新成功，请重新登录"
        })
    } else {
        res.response({
            status: 200, code: 0, msg: "更新成功", data: response.data
        })
    }
}

export function route(router) {
    router.post('/password', ...makeMiddleware([
        checkInput,
        checkUser,
        checkSms,
        reset,
        genToken
    ]))
}
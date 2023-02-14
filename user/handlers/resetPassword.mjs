'use strict'

import {isBadFieldString} from "../../common/utils.mjs";
import {InvalidArgument} from "../../common/errors/00000-basic.mjs";
import {makeMiddleware} from "../../common/flow.mjs";
import {UserNotExists, VerifySmsCodeFailed} from "../../common/errors/10000-user.mjs";

function checkInput(req) {
    if (isBadFieldString(req.body.smsCode) || isBadFieldString(req.body.newPassword)) {
        throw new InvalidArgument()
    }
}

async function checkUser(req) {
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

function allDone(req, res) {
    res.response({
        status: 200, code: 0, msg: "密码更新成功"
    })
}

export function route(router) {
    router.post('/password', ...makeMiddleware([
        checkInput,
        checkUser,
        checkSms,
        reset,
        allDone
    ]))
}
'use strict'

import {isBadFieldString, isBadPhone} from "../../common/utils.mjs";
import {InvalidArgument} from "../../common/errors/00000-basic.mjs";
import {makeMiddleware} from "../../common/flow.mjs";
import {UserNotExists, VerifySmsCodeFailed} from "../../common/errors/10000-user.mjs";

function checkInput(req) {
    if (isBadFieldString(req.body.smsCode)
        || isBadFieldString(req.body.newPassword)
        || isBadFieldString(req.body.phone)
        || isBadPhone(req.body.phone)
    ) {
        throw new InvalidArgument()
    }
}

async function checkUser(req) {
    const user = await req.context.mongo.getPassword()
    if (user === null) {
        throw new UserNotExists()
    }
}

async function checkSms(req) {
    const response = await req.context.stubs.sms.verify(req.body.phone, req.body.smsCode)
    if (response.isError()) {
        throw new VerifySmsCodeFailed()
    }
}

async function reset(req) {
    const encodedPassword = await req.context.password.encode(req.body.newPassword)
    await req.context.mongo.updatePassword(req.body.phone, encodedPassword)
}

// async function genToken(req, res) {
//     const response = await req.context.stubs.token.gen(tokenPayload(req.headers.id, req.headers.phone))
//     if (response.isError()) {
//         res.response({
//             status: 200, code: 0, msg: "更新成功，请重新登录"
//         })
//     } else {
//         res.response({
//             status: 200, code: 0, msg: "更新成功", data: response.data
//         })
//     }
// }

function success(req, res) {
    res.response({
        status: 200, code: 0, msg: "更新成功"
    })
}

export function route(router) {
    router.post('/password', ...makeMiddleware([
        checkInput,
        checkUser,
        checkSms,
        reset,
        // genToken,
        success
    ]))
}
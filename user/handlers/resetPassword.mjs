'use strict'

import {isBadFieldString, isBadPhone} from "../../common/utils.mjs";
import {InvalidArgument} from "../../common/errors/00000-basic.mjs";
import {makeMiddleware} from "../../common/flow.mjs";
import {PasswordNotMatch, UserNotExists, VerifySmsCodeFailed} from "../../common/errors/10000-user.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

function checkInput(req) {
    if (
        isBadFieldString(req.body.smsCode)
        || isBadFieldString(req.body.newPassword)
    ) {
        throw new InvalidArgument()
    }

    if (req.headers.id === undefined) {
        if (isBadFieldString(req.body.phone) || isBadPhone(req.body.phone)) {
            throw new InvalidArgument()
        }
    } else {
        if (isBadFieldString(req.body.oldPassword)) {
            throw new InvalidArgument()
        }
    }
}

async function checkUser(req) {
    const user = await req.context.mongo.getPassword({userId: req.headers.id, phone: req.body.phone})
    if (user === null) {
        throw new UserNotExists()
    }
    req.user = user
}

async function checkPassword(req) {
    if (req.headers.id !== undefined) {
        const success = await req.context.password.verify(req.user.password, req.body.oldPassword)
        if (!success) {
            throw new PasswordNotMatch()
        }
    }
}

async function checkSms(req) {
    const response = await req.context.stubs.sms.verify(req.user.phone, req.body.smsCode)
    if (response.isError()) {
        throw new VerifySmsCodeFailed()
    }
}

async function reset(req) {
    const encodedPassword = await req.context.password.encode(req.body.newPassword)
    await req.context.mongo.updatePassword(req.user._id, encodedPassword)
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
    res.tkResponse(TKResponse.Success())
}

export function route(router) {
    router.post('/user/password', ...makeMiddleware([
        checkInput,
        checkUser,
        checkPassword,
        checkSms,
        reset,
        // genToken,
        success
    ]))
}
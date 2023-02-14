'use strict'

import {isBadFieldString, isBadFiledObject, isBadPhone} from "../../common/utils.mjs";
import {InvalidArgument} from "../../common/errors/00000-basic.mjs";
import {makeMiddleware} from "../../common/flow.mjs";
import {ResetAccountFailed, VerifySmsCodeFailed} from "../../common/errors/10000-user.mjs";
import {tokenPayload} from "../stubs.mjs";

function checkInput(req) {
    if (isBadFiledObject(req.body.old)
        || isBadFieldString(req.body.old.phone)
        || isBadFieldString(req.body.old.password)
        || isBadFiledObject(req.body.new)
        || isBadFieldString(req.body.new.phone)
        || isBadFieldString(req.body.new.password)
        || isBadPhone(req.body.new.phone)
    ) {
        throw new InvalidArgument()
    }
}

async function checkUser(req) {
    const user = await req.context.mongo.getUserById(req.headers.id)

    const invalidPassword = async () => {
        return !(await req.context.password.verify(user.password, req.body.old.password))
    }

    if (
        user === null
        || user.phone !== req.headers.phone
        || await invalidPassword()
    ) {
        throw new ResetAccountFailed()
    }
}

async function checkCode(req) {
    const response = await req.context.stubs.sms.verify(req.body.new.phone, req.body.smsCode)
    if (response.isError()) {
        throw new VerifySmsCodeFailed()
    }
}

async function updateDb(req) {
    const encodedPassword = await req.context.password.encode(req.body.new.password)
    await req.context.mongo.updateAccount(req.headers.id, req.body.new.phone, encodedPassword)
}

async function genToken(req, res) {
    const response = await req.context.stubs.token.gen(tokenPayload(req.headers.id, req.body.new.phone))
    if (response.isError()) {
        res.response({
            status: 200,
            code: 0,
            msg: "更新成功，请重新登录",
        })
    } else {
        res.response({
            status: 200,
            code: 0,
            msg: "更新成功",
            data: response.data
        })
    }
}

export function route(router) {
    router.post("/account", ...makeMiddleware([
        checkInput,
        checkUser,
        checkCode,
        updateDb,
        genToken
    ]))
}

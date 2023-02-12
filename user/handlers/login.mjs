'use strict'

import {TKError} from "../../errors/error.mjs";
import argon2i from "argon2";
import {Token} from "../stubs.mjs";
import {userRouter} from "../router.mjs";
import {handle} from "../middleware.mjs";
import 'express-async-errors'
import {InvalidArgument} from "../../errors/00000-basic.mjs";

class UserNotFound extends TKError {
    constructor({code = -200} = {}) {
        super({
            httpCode: 404,
            code: code,
            msg: "用户名或密码错误"
        });
    }
}

class PasswordNotMatch extends TKError {
    constructor({code = -201} = {}) {
        super({
            httpCode: 403,
            code: code,
            msg: "用户名或密码错误"
        });
    }
}

class TokenFailed extends TKError {
    constructor({code = -202} = {}) {
        super({
            httpCode: 500,
            code: code,
            msg: "登录失败，请稍后重试"
        });
    }
}

function checkInput(req) {
    function isBadField(field) {
        return (typeof field !== "string") || field.length === 0;
    }

    if (isBadField(req.body.phone)) {
        throw new InvalidArgument({code: -100, msg: "phone"})
    }
    if (isBadField(req.body.password)) {
        return new InvalidArgument({code: -101, msg: "password"})
    }
}

async function getUser(req) {
    console.log(`getUser: phone:${req.body.phone}`)
    const user = await req.context.mongo.db.collection("users")
        .findOne({phone: req.body.phone})
    console.log(`getUser: ${JSON.stringify(user)}`)
    if (user === null) {
        throw new UserNotFound()
    } else {
        req.user = user
    }
}

async function checkPassword(req) {
    console.log(`checkPassword, server:${req.user.password}, plain:${req.body.password}`)
    const matched = await argon2i.verify(req.user.password, req.body.password)
    if (!matched) {
        throw new PasswordNotMatch()
    }
}

async function genToken(req, res) {
    const result = await Token.generate({phone: req.body.phone})
    if (!result.isSuccess()) {
        throw new TokenFailed()
    } else {
        res.response({
            data: result.data
        })
    }
}

userRouter.post("/login", ...handle([
    checkInput,
    getUser,
    checkPassword,
    genToken
]))
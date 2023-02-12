'use strict'

import argon2i from "argon2";
import {InvalidArgument} from "../../common/errors/00000-basic.mjs";
import {makeMiddleware} from "../../common/flow.mjs";
import {LoginFailed, PasswordNotMatch} from "../../common/errors/10000-user.mjs";


function checkInput(req) {
    function isBadField(field) {
        return (typeof field !== "string") || field.length === 0;
    }

    if (isBadField(req.body.phone)) {
        throw new InvalidArgument()
    }
    if (isBadField(req.body.password)) {
        throw new InvalidArgument()
    }
}

async function getUser(req) {
    // console.log(`getUser: phone:${req.body.phone}`)
    // const user = await req.context.mongo.db.collection("users")
    //     .findOne({phone: req.body.phone})
    // console.log(`getUser: ${JSON.stringify(user)}`)
    const user = await req.context.mongo.getUserByPhone(req.body.phone)
    if (user === null) {
        throw new PasswordNotMatch()
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
    // const result = await Token.generate({phone: req.body.phone})
    const result = await req.context.stubs.token.gen({phone: req.body.phone})
    if (!result.isSuccess()) {
        throw new LoginFailed()
    } else {
        res.response({
            msg: "登录成功",
            data: result.data
        })
    }
}

export function route(router) {
    router.post("/login", ...makeMiddleware([
        checkInput,
        getUser,
        checkPassword,
        genToken
    ]))
}

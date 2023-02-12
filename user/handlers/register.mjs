'use strict'

import {makeMiddleware} from "../../common/flow.mjs";
import {UserExists, UserNotExists} from "../../errors/10000-user.mjs"
import {InvalidArgument} from "../../errors/00000-basic.mjs";
import argon2i from "argon2";

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
    if (req.body.inviter !== undefined &&
        isBadField(req.body.inviter.id)) {
        throw new InvalidArgument()
    }
}

async function checkUserExist(req) {
    const user = await req.context.mongo.getUserByPhone(req.body.phone)
    if (user !== null) {
        throw new UserExists({msg: "手机已注册"})
    }
}

async function getInviter(req) {
    if (req.body.inviter === undefined) {
        return
    }
    const inviter = await req.context.mongo.getUserById(req.body.inviter.id)
    if (inviter === null) {
        throw new UserNotExists({msg: "邀请人不存在"})
    }
    req.inviter = inviter
}

async function registerHandler(req) {
    const register = async ({registerUser, inviter, config}) => {
        function todayTimestamp() {
            return Math.floor(new Date(new Date().toISOString().slice(0, 10).replaceAll("-", "/")).getTime() / 1000)
        }

        registerUser.password = await argon2i.hash(registerUser.password)
        registerUser.member = {
            expiration: todayTimestamp() + config.daysForRegister * 86400
        }

        if (inviter === undefined) {
            return {
                registerUser
            }
        }

        registerUser.upLine = inviter.id
        if (inviter.downLines === undefined) {
            inviter.downLines = [registerUser.phone]
        } else {
            inviter.downLines.push(registerUser.phone)
        }
        const baseline = Math.max(inviter.member.expiration, todayTimestamp())
        inviter.member.expiration = baseline + config.daysForInvite * 86400
        return {
            registerUser, inviter
        }
    }

    const result = await register({
        registerUser: {
            phone: req.body.phone, password: req.body.password
        },
        inviter: req.inviter,
        config: req.config,
    })

    req.updateDB = {
        registerUser: result.registerUser,
        inviter: result.inviter
    }
}

async function updateDB(req) {
    req.context.mongo.insertAndUpdate({
        user: req.updateDB.registerUser,
        inviter: req.updateDB.inviter === undefined ? undefined : {
            filter: {_id: req.body.inviter.id},
            update: {
                $set: {
                    member: req.updateDB.inviter.member,
                    downLines: req.updateDB.inviter.downLines
                }
            }
        }
    })
}

async function genToken(req, res) {
    const response = await req.context.stubs.token.gen({phone: req.body.phone})
    if (response.isError()) {
        res.response({
            status: 201,
            code: response.code,
            msg: "注册成功，请重新登录"
        })
    } else {
        res.response({
            status: 201,
            code: 0,
            msg: "注册成功",
            data: response.data
        })
    }
}

export function route(router) {
    router.post('/register', ...makeMiddleware([
        checkInput,
        checkUserExist,
        getInviter,
        registerHandler,
        updateDB,
        genToken
    ]))
}
'use strict'

import {makeMiddleware} from "../../common/flow.mjs";
import {RegisterFailed, UserExists, UserNotExists, VerifySmsCodeFailed} from "../../common/errors/10000-user.mjs"
import {InternalError, InvalidArgument} from "../../common/errors/00000-basic.mjs";
import {now} from "../../common/utils.mjs";

// import argon2i from "argon2";

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
    if (isBadField(req.body.smsCode)) {
        throw new InvalidArgument()
    }
    if (req.body.inviter !== undefined &&
        isBadField(req.body.inviter.id)) {
        throw new InvalidArgument()
    }
}

async function checkUserExist(req) {
    const user = await req.context.mongo.getUserByPhone({phone: req.body.phone}, {_id: 1})
    if (user !== null) {
        throw new UserExists({msg: "手机已注册"})
    }
}

async function getInviter(req) {
    if (req.body.inviter === undefined) {
        return
    }
    const inviter = await req.context.mongo.getInviter(req.body.inviter.id)
    if (inviter === null) {
        throw new UserNotExists({msg: "邀请人不存在"})
    }
    req.inviter = inviter
}

async function getConfig(req) {
    const response = await req.context.stubs.system.settings.get("registerPrice")
    if (response.isError()) {
        throw new InternalError()
    }
    req.config = (Object.keys(response.data).length === 0) ? {
        daysForRegister: 7, daysForInvite: 3
    } : response.data
}

async function verifySms(req) {
    const response = await req.context.stubs.sms.verify(req.body.phone, req.body.smsCode)
    if (response.isError()) {
        throw new VerifySmsCodeFailed()
    }
}

// db 操作， 可以和updateInviter, 优化在transaction里执行
async function register(req) {
    req.updateDB = {
        registerUser: {}
    }

    const registerUser = {}
    const config = req.config

    registerUser.phone = req.body.phone
    registerUser.password = await req.context.password.encode(req.body.password)
    registerUser.member = {
        expiration: now() + config.daysForRegister * 86400
    }
    registerUser.registeredAt = now()
    registerUser.contact = {
        qq: {
            account: req.body.qq === undefined ? "" : req.body.qq,
            open: false
        },
        wechat: {
            account: req.body.wechat === undefined ? "" : req.body.wechat,
            open: false
        },
        phone: {
            open: false
        }
    }
    registerUser.name = req.body.name === undefined ? "" : req.body.name

    if (req.inviter !== undefined) {
        registerUser.upLine = req.inviter._id
    }

    req.registerId = await req.context.mongo.register(registerUser)
    if (req.registerId === null) {
        throw new RegisterFailed()
    }
}

async function updateInviter(req) {
    if (req.inviter === undefined) {
        return
    }

    const inviter = req.inviter
    const config = req.config

    const downLine = {
        id: req.registerId
    }
    if (inviter.downLines === undefined) {
        inviter.downLines = [downLine]
    } else {
        inviter.downLines.push(downLine)
    }
    const baseline = Math.max(inviter.member.expiration, now())
    inviter.member.expiration = baseline + config.daysForInvite * 86400

    const success = await req.context.mongo.updateInviter(inviter._id, {
        downLines: inviter.downLines,
        "member.expiration": inviter.member.expiration
    })

    if (!success) {
        throw new RegisterFailed()
    }
}

async function genToken(req, res) {
    const response = await req.context.stubs.token.gen({id: `${req.registerId}`, phone: req.body.phone})
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
    router.post('/user/register', ...makeMiddleware([
        checkInput,
        checkUserExist,
        getInviter,
        getConfig,
        verifySms,
        register,
        updateInviter,
        genToken
    ]))
}
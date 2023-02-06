'use strict'

import {v4 as uuidv4} from 'uuid'
import {System, Token, User, V2ray} from "./stub.mjs";
import {Response} from "./response.mjs";
import argon2i from "argon2";

import nodeTemplate from "./node_template.json" assert {type: "json"}

const registerPrizeKey = "register_prize"
const invitePrizeKey = "invite_prize"


function isFieldInvalid(field) {
    return (typeof field !== "string") || field.length === 0;
}

export async function register(r) {
    function checkInput() {
        if (isFieldInvalid(r.username)) {
            return -101
        }
        if (isFieldInvalid(r.password)) {
            return -102
        }
        if (isFieldInvalid(r.deviceId)) {
            return -102
        }
        return 0
    }

    const checkResult = checkInput()
    if (checkResult !== 0) {
        return {code: checkResult, msg: "参数错误"}
    }

    const uuid = uuidv4()

    async function updateDb() {
        const rPrizeResult = await System.getConfig(registerPrizeKey)
        if (rPrizeResult.isError()) {
            console.log(rPrizeResult.msg)
            return -201
        }

        async function buildInviter() {
            if (isFieldInvalid(r.inviteCode)) {
                return {code: 0}
            }

            const countResult = await User.countDevice(r.deviceId)
            if (countResult.isError()) {
                console.log(countResult.msg)
                return -202
            }

            if (countResult.data.count > 0) {
                return {code: 0, data: {uuid: r.inviteCode}}
            }

            const iPrizeResult = await System.getConfig(invitePrizeKey)
            if (iPrizeResult.isError()) {
                console.log(iPrizeResult.msg)
                return {code: -203}
            }

            return {code: 0, data: {uuid: r.inviteCode, days: parseInt(iPrizeResult.data.value, 10)}}
        }

        const bRes = await buildInviter()
        const buildInviterResult = new Response(bRes)
        if (buildInviterResult.isError()) {
            return buildInviterResult.code
        }

        const encryptedPassword = await argon2i.hash(r.password)

        const addResult = await User.addUser({
                name: r.username,
                password: encryptedPassword,
                uuid: uuid,
                days: parseInt(rPrizeResult.data.value, 10),
                deviceId: r.deviceId
            }, buildInviterResult.data
        )
        if (addResult.isError()) {
            console.log(addResult.toString())
            if (addResult.code === -100) {
                return -204
            } else {
                return -205
            }
        }
        return 0
    }

    const updateCode = await updateDb()
    if (updateCode !== 0) {
        if (updateCode === -204) {
            return {code: updateCode, msg: "用户名已存在"}
        } else {
            return {code: updateCode, msg: "注册失败，请稍后重试"}
        }
    }

    // do not wait
    V2ray.add(uuid, r.username)

    const tokenResult = await Token.generate({uuid, inviteCode: uuid})
    if (tokenResult.isError()) {
        return {code: -300, msg: "注册成功，请重新登录"}
    }

    return {code: 0, msg: "注册成功", data: tokenResult.data}
}

export async function login(r) {
    function checkInput() {
        if (isFieldInvalid(r.username)) {
            return -101
        }
        if (isFieldInvalid(r.password)) {
            return -102
        }
        return 0
    }

    const checkResult = checkInput()
    if (checkResult !== 0) {
        return {code: checkResult, msg: "参数错误"}
    }

    const userResult = await User.getByName(r.username)
    if (userResult.isError()) {
        console.log(userResult.toString())
        return {code: -201, msg: "登录失败，请稍后重试"}
    }

    if (userResult.code === 1) {
        return {code: -202, msg: "用户名或密码错误"}
    }

    const user = userResult.data

    const matched = await argon2i.verify(user.password, r.password)
    if (!matched) {
        return {code: -203, msg: "用户名或密码错误"}
    }

    // do not wait
    V2ray.add(user.uuid, user.name)

    const tokenResult = await Token.generate({
        uuid: user.uuid,
        inviteCode: user.uuid
    })
    if (tokenResult.isError()) {
        return {code: -300, msg: "登录失败，请稍后重试"}
    }

    return {
        code: 0, msg: "success", data: tokenResult.data
    }
}

export async function getDeadline(uuid) {
    if (uuid === undefined || uuid === "") {
        return {code: -100, msg: "参数错误"}
    }

    const userResult = await User.getByUUID(uuid)
    if (userResult.isError()) {
        console.log(userResult.toString())
        return {code: -200, msg: "查询错误，请稍后重试"}
    }

    if (userResult.code !== 0) {
        return {code: -201, msg: "查询错误，请稍后重试"}
    }

    const user = userResult.data
    const expireIn = Math.max(0, (user.deadline - Math.floor(Date.now() / 1000)))
    return {
        code: 0, msg: "success", data: {
            expireIn, expireAt: user.deadline
        }
    }
}

export async function listNode(uuid) {
    if (uuid === undefined || uuid === "") {
        return {code: -100, msg: "参数错误"}
    }

    const userResult = await User.getByUUID(uuid)
    if (userResult.isError()) {
        console.log(userResult.toString())
        return {code: -200, msg: "查询错误，请稍后重试"}
    }

    if (userResult.code !== 0) {
        return {code: -201, msg: "查询错误，请稍后重试"}
    }

    const user = userResult.data

    const nodeResult = await System.getNodes()
    if (nodeResult.isError()) {
        console.log(userResult.toString())
        return {code: -300, msg: "查询错误，请稍后重试"}
    }

    if (nodeResult.data.length === 0) {
        return {code: -301, msg: "查询错误，请稍后重试"}
    }

    const nodes = nodeResult.data
    const vnextList = nodes
        .map(x => {
            return {
                name: x.name,
                address: x.ip,
                port: x.port,
                users: [{
                    id: user.uuid,
                    alterId: 0
                }]
            }
        })

    let out = nodeTemplate
    out.Outbounds[0].settings.vnext = vnextList
    return {code: 0, msg: "success", data: [out]}
}

export async function refreshToken(accessToken, refreshToken) {
    const result = await Token.refresh(accessToken, refreshToken)
    if (result.isError()) {
        console.log(result.toString())
        return {code: -100, msg: "刷新错误, 请重新登录"}
    }
    return {code: 0, msg: "success", data: result.data}
}
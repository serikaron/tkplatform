'use strict'

import axios from "axios";
import crypto from "crypto";
import {now} from "../common/utils.mjs";

function serialize(obj) {
    switch (typeof obj) {
        case "number":
            return obj
        case "boolean":
            return obj
        case "string":
            return obj
        case "bigint":
            return obj
        case "object":
            return _handleObject(obj)
        default:
            return ""
    }

    // object
    function _handleObject(obj) {
        let a = []
        for (let i in obj) {
            a.push([i, serialize(obj[i])])
        }
        if (Array.isArray(obj)) {
            return a.map(x => x[1]).join("")
        } else {
            return a.sort().map(x => x.join("=")).join("&")
        }
    }
}

const sign = (body) => {
    const source = serialize(body) + "&key=61DE86C244CB3CAA33CA707A0A472677"
    return crypto.createHash('md5').update(source).digest('hex').toUpperCase()
}
const login = async () => {
    const body = {
        "phone": "13587021931",
        "type": 0,
        "pwd": "hxy197984",
    }
    body.sign = sign(body)
    const r = await axios.post("https://mai.kaiguo.vip/api.php/user/login", body)
    return {
        uid: r.data.data.uid,
        token: r.data.data.token
    }
}

const getPlatformList = async (uid) => {
    const body = {
        uid,
        time: now()
    }
    body.sign = sign(body)
    const r = await axios.post("https://mai.kaiguo.vip/api.php/platform/getList", body)
    return r.data.data.map(x => x.id)
}

const getAccountList = async (uid, pid) => {
    const body = {
        uid, pid,
        state: 1,
        time: now()
    }
    body.sign = sign(body)
    const r = await axios.post("https://mai.kaiguo.vip/api.php/Member/getList", body)
    return r.data.data.data.map(x => x.id)
}


const task = async (uid, token, pid, aids) => {
    const body = {
        uid, token, pid, aids
    }
    body.sign = sign(body)
    const r = await axios.post("https://mai.kaiguo.vip/api.php/task/receiving", body)
    console.log(`嗨推, ${new Date().toLocaleString()}, ${JSON.stringify(r.data)}`)
}

const loginRsp = await login()
const uid = loginRsp.uid
const token = loginRsp.token
const platformList = await getPlatformList(uid)
const tasks = []
for (const pid of platformList) {
    const accountList = await getAccountList(uid, pid)
    for (const aids of accountList) {
        tasks.push({
            uid, token, pid, aids
        })
    }
}

while (true) {
    try {
        for (const t of tasks) {
            await task(t.uid, t.token, t.pid, t.aids)
        }
        await new Promise(resolve => setTimeout(resolve, 180 * 1000))
    } catch (e) {
        console.log(e)
    }
}

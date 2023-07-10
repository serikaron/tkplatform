'use strict'

import crypto from "crypto";

const magicSecret = "Sp31hvNSqa"
const version = "3.9.12"

const sign = (api, time, device, token) => {
    // const randomCustom = Math.random().toString(36).substr(2)
    const randomCustom = "mixzkeipdn8"
    const source = magicSecret + "api" + api.toLowerCase() + time + device + version + token + randomCustom
    console.log(source)
    return crypto.createHash('md5').update(source).digest('hex').toLowerCase()
}

const body = "token=25232_1688458343_f258c927ad83a45b50337116e9efa4f1&uid=25232"
const body1 = "uid=25232"
const url = "/member/task"
const s = sign(url, 1688965253, "api", "25232_1688458343_f258c927ad83a45b50337116e9efa4f1")
console.log(s)
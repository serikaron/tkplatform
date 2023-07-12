'use strict'

import crypto from "crypto";
import axios from "axios";
import {now} from "../nodes/common/utils.mjs";

const magicSecret = "Sp31hvNSqa"
const magicSecret1 = "rjZA1KR8rjFqzNP461XwF7Gk8x3L"
const version = "3.9.12"
const userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5.1 Safari/605.1.15"

const decode = (data, time, sign) => {
    const key = crypto.createHash('md5').update(sign).digest()
    const iv = crypto.createHash('md5').update(`key_${time}`).digest()
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    let decryptedData = decipher.update(data, 'base64', 'utf8')
    decryptedData += decipher.final('utf8');
    return decryptedData;
}
const sign = (api, time, token, randomCustom) => {
    // const randomCustom = Math.random().toString(36).substr(2)
    // const randomCustom = "mh3w28wnq3b"
    const source = magicSecret1 + "api" + api.toLowerCase() + time + 'api' + version + token + randomCustom
    console.log(source)
    return crypto.createHash('md5').update(source).digest('hex').toLowerCase()
}

const buildHeaders = (api, time, token) => {
    const randomCustom = Math.random().toString(36).substr(2)
    return {
        "User-Agent": userAgent,
        time,
        custom: randomCustom,
        version,
        encrypt: 1,
        sign: sign(api, time, token, randomCustom),
        device: "api"
    }
}

const login = async () => {
    const r = await axios.post('http://159.75.153.25:1788/api/login/login', {
        "phone": "15833356985",
        "password": "123456"
    }, {
        headers: buildHeaders("/login/login", now(), "")
    })
    console.log(r.data)

    return decode(r.data.extend, r.data.time, r.data.sign)
}

const user = await login()

// const body = "token=25232_1688458343_f258c927ad83a45b50337116e9efa4f1&uid=25232"
// const body1 = "uid=25232"
// const url = "/member/app_cfg"
// const s = sign(url, 1688813247, "api", "25232_1688458343_f258c927ad83a45b50337116e9efa4f1")
// console.log(s)

// rjZA1KR8rjFqzNP461XwF7Gk8x3Lapi/member/app_cfg1688813247api3.9.1225232_1688458343_f258c927ad83a45b50337116e9efa4f1mh3w28wnq3b

// const data = "tcBNhvqsNqjv3dksBepBf4AJkc8CTJ0cBwMFAwZV8FsTx+xudwWRdrSzAL8bKyxkeCcrueLmMqn1FZhkyp1KUjEUARR4HHmXa1t3tAFZiZye6CWZXQGb6jC1saE6HRbKtGpotjcXScLPWOLP0JCxBzB4egaiMUq+yL2iUQPYMEc="
// // const data = '4Jtp7DEhgQXA86V4ROXjQvyAAt08Ut+FogOWLbmxk04='
// const key = crypto.createHash('md5').update(`key_${1688813246}`).digest()
// // const iv = crypto.createHash('md5').update('5c3ef2108fc17a321ca3b5d714118075').digest()
// const iv = Buffer.from('5c3ef2108fc17a321ca3b5d714118075', 'hex')
// console.log(iv.length)
// const iv1 = crypto.createHash('md5').update('5c3ef2108fc17a321ca3b5d714118075').digest()
// console.log(iv1.length)
// const secret = getSecret(data, iv1, key)
// console.log(secret)

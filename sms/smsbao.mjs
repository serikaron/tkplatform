'use strict'

import axios from 'axios'


const api = "https://api.smsbao.com"

export async function sendSMS(phone, code) {
    const msg = `【星济助手】您的验证码是${code}。如非本人操作，请忽略本短信`
    try {
        const res = await axios({
            url: "/sms",
            baseURL: api,
            method: 'GET',
            params: {
                u: process.env.SMSBAO_USER,
                p: process.env.SMSBAO_KEY,
                m: phone,
                c: msg,
            }
        })
        if (res.data !== 0) {
            console.log(`sendSMS failed, phone:${phone}, code:${code}, status:[${res.data} - ${statusStr(res.data)}]`)
            return -1
        }
        return 0
    } catch (e) {
        console.log(`sendSMS, phone: ${phone}, code: ${code}, ERROR, ${e}`)
        return -2
    }
}

function statusStr(result){
    switch(result)
    {
        case 0:
            return '短信发送成功'
        case -1:
            return '参数不全'
        case -2:
            return '服务器空间不支持,请确认支持curl或者fsocket，联系您的空间商解决或者更换空间！'
        case 30:
            return '密码错误'
        case 40:
            return '账户不存在'
        case 41:
            return '余额不足'
        case 42:
            return '账户已过期'
        case 43:
            return 'IP地址限制'
        case 50:
            return '内容含有敏感字'
    }
}
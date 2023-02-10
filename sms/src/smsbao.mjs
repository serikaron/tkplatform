'use strict'

import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const api = "https://api.smsbao.com"

export async function sendSMS(phone, code) {
    const msg = `【星济助手】您的验证码是${code}。如非本人操作，请忽略本短信`
    const encoded = encodeURI(msg)
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
        const status = res.data
        if (data !== '0') {
            console.log(`sendSMS failed, phone:${phone}, code:${code}, status:[${status} - ${statusStr(status)}]`)
            return -1
        }
        return 0
    } catch (e) {
        console.log(`sendSMS ERROR, ${e}`)
        return -2
    }
}

function statusStr(result){
    switch(result)
    {
        case '0':
            console.log('短信发送成功')
            break
        case '-1':
            console.log('参数不全')
            break
        case '-2':
            console.log('服务器空间不支持,请确认支持curl或者fsocket，联系您的空间商解决或者更换空间！')
            break
        case '30':
            console.log('密码错误')
            break
        case '40':
            console.log('账户不存在')
            break
        case '41':
            console.log('余额不足')
            break
        case '42':
            console.log('账户已过期')
            break
        case '43':
            console.log('IP地址限制')
            break
        case '50':
            console.log('内容含有敏感字')
            break
    }
}
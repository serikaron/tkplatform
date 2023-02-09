'use strict'

import express from "express";
import {create as createCaptcha} from 'svg-captcha'
import {createClient as createRedis} from "redis";

const app = express()
const port = 8080

app.use(express.json())

function isBadField(field) {
    return (typeof field !== "string") || field.length === 0;
}

app.post('/v1/captcha/require', async (req, res) => {
    if (isBadField(req.body.phone)) {
        res.status(400).json({
            code: -100, msg: "参数错误"
        })
        return
    }

    const captcha = createCaptcha()
    const redis = createRedis({url: 'redis://captcha_cache'})
    await redis.connect()
    await redis.set(req.body.phone, captcha.text, "EX", 300)

    // res.type('svg')
    res.status(200).json({
        code: 0, msg: "success",
        captcha: captcha.data
    })
})

app.post('/v1/captcha/verify', async (req, res) => {
    if (isBadField(req.body.phone)) {
        res.status(400).json({
            code: -100, msg: "参数错误"
        })
        return
    }
    if (isBadField(req.body.code)) {
        res.status(400).json({
            code: -100, msg: "参数错误"
        })
        return
    }

    const redis = createRedis({url: 'redis://captcha_cache'})
    await redis.connect()
    const serverCode = await redis.get(req.body.phone)

    if (serverCode === null || serverCode !== req.body.code) {
        res.status(200).json({
            code: -101, msg: "图形码错误"
        })
    } else {
        res.status(200).json({
            code: 0, msg: "success"
        })
    }
})

app.listen(port, () => {
    console.log('captcha service started')
});
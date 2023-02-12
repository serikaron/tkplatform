'use strict'


import express from "express";
import {handleWithoutAuth1} from "../middleware.mjs";
import 'express-async-errors'
import {call} from "../../../stubs/call.mjs";
import axios from "axios";
import {v1Router} from "../router.mjs";


const smsRouter = express.Router()
v1Router.use('/sms', smsRouter)

class sms {
    static baseURL = "http://sms:8080/v1/sms"

    static async send(body) {
        return call(async () => {
            return axios({
                url: `/send`,
                baseURL: this.baseURL,
                method: 'post',
                data: body,
            })
        })
    }
}

/**
 * @swagger
 * /v1/sms/send:
 *   post:
 *     tags: ["sms(短信服务)"]
 *     description: 发送验证码到手机
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "13333333333"
 *               captcha:
 *                  type: string
 *                  example: "4iF9"
 *
 *     responses:
 *       200:
 *         description: 发送成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: "success"
 *
 */
smsRouter.post('/send', ...handleWithoutAuth1(async (req) => {
    return await sms.send(req.body)
}))

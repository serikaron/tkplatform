'use strict'


import express from "express";
import {handleWithoutAuth1} from "../middleware.mjs";
import 'express-async-errors'
import {call} from "../../../stubs/call.mjs";
import axios from "axios";
import {v1Router} from "../router.mjs";


const captchaRouter = express.Router()
v1Router.use('/captcha', captchaRouter)

class Captcha {
    static baseURL = "http://captcha:8080/v1/captcha"

    static async require(body) {
        return call(async () => {
            return axios({
                url: `/require`,
                baseURL: this.baseURL,
                method: 'post',
                data: body,
            })
        })
    }

    static async verify(body) {
        return call(async () => {
            return axios({
                url: "/verify",
                baseURL: this.baseURL,
                method: 'post',
                data: body
            })
        })
    }
}

/**
 * @swagger
 * /v1/captcha/require:
 *   post:
 *     tags: ["captcha(图形码)"]
 *     description: 获取图形码
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "13333333333"
 *
 *     responses:
 *       200:
 *         description: 获取成功
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     captcha:
 *                       type: string
 *                       example: "html"
 *
 */
captchaRouter.post('/require', ...handleWithoutAuth1(async (req) => {
    return await Captcha.require(req.body)
}))

/**
 * @swagger
 * /v1/captcha/verify:
 *   post:
 *     tags: ["captcha(图形码)"]
 *     description: 验证图形码
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "13333333333"
 *               code:
 *                 type: string
 *                 example: "3gE9"
 *
 *     responses:
 *       200:
 *         description: OK
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
captchaRouter.post('/verify', ...handleWithoutAuth1(async (req) => {
    return await Captcha.verify(req.body)
}))
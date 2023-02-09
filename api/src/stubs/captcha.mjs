'use strict'


import express from "express";
import {handleWithoutAuth1} from "../middleware.mjs";
import 'express-async-errors'
import {call} from "../../../common/call.mjs";
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

captchaRouter.post('/require', ...handleWithoutAuth1(async (req, res) => {
    const response = await Captcha.require(req.body)
    res.onSuccess(response.data, response.code, response.msg)
}))

captchaRouter.post('/verify', ...handleWithoutAuth1(async (req, res) => {
    const response = await Captcha.verify(req.body)
    res.onSuccess(response.data, response.code, response.msg)
}))
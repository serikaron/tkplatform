'use strict'


import express from "express";
import {handleWithoutAuth1} from "../middleware.mjs";
import 'express-async-errors'
import {call} from "../../../common/call.mjs";
import axios from "axios";
import {v1Router} from "../router.mjs";

const userRouter = express.Router()
v1Router.use('/user', userRouter)

class User {
    static baseURL = "http://user:8080/v1/user"

    static async register(body) {
        return call(async () => {
            return axios({
                url: `/register`,
                baseURL: this.baseURL,
                method: 'post',
                data: body,
            })
        })
    }

    static async login(body) {
        return call(async () => {
            return axios({
                url: "/login",
                baseURL: this.baseURL,
                method: 'post',
                data: body
            })
        })
    }
}

/**
 * @swagger
 * /v1/user/register:
 *   post:
 *     tags: ["user(用户相关)"]
 *     description: 用户注册
 *     requestBody:
 *       required: ["phone", "password"]
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "13333333333"
 *                 required: true
 *               password:
 *                 type: string
 *                 example: "123456"
 *                 required: true
 *               inviter:
 *                 type: object
 *                 properties:
 *                   phone:
 *                     type: string
 *                     example: "13444444444"
 *
 *     responses:
 *       200:
 *         description: 注册成功
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
 *                     accessToken:
 *                       type: string
 *                       example: "a jwt object"
 *                     refreshToken:
 *                       type: string
 *                       example: "96defd9f-1a54-4cb8-b501-9076d8709074"
 *       409:
 *         description: 用户已存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: -100
 *                 msg:
 *                   type: string
 *                   example: "用户已存在"
 *
 *
 */
userRouter.post('/register', ...handleWithoutAuth1(async (req) => {
    return await User.register(req.body)
}))

/**
 * @swagger
 * /v1/user/login:
 *   post:
 *     tags: ["user(用户相关)"]
 *     description: 用户登录
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "13333333333"
 *                 required: true
 *               password:
 *                 type: string
 *                 example: "123456"
 *                 required: true
 *
 *     responses:
 *       200:
 *         description: 登录成功
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
 *                     accessToken:
 *                       type: string
 *                       example: "a jwt object"
 *                     refreshToken:
 *                       type: string
 *                       example: "96defd9f-1a54-4cb8-b501-9076d8709074"
 *       404:
 *         description: 用户名或密码错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: -200
 *                 msg:
 *                   type: string
 *                   example: "用户名或密码错误"
 *
 *
 */
userRouter.post('/login', ...handleWithoutAuth1(async (req) => {
    return await User.login(req.body)
}))
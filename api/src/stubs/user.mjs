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

userRouter.post('/register', ...handleWithoutAuth1(async (req) => {
    return await User.register(req.body)
}))

userRouter.post('/login', ...handleWithoutAuth1(async (req) => {
    return await User.login(req.body)
}))
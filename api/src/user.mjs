'use strict'


import express from "express";
import {handleWithoutAuth1} from "./middleware.mjs";
import 'express-async-errors'
import {call} from "../../common/call.mjs";
import axios from "axios";

export const v1Router = express.Router()

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

userRouter.post('/register', ...handleWithoutAuth1(async (req, res) => {
    const response = await User.register(req.body)
    res.onSuccess(response.data, response.code, response.msg)
}))

userRouter.post('/login', ...handleWithoutAuth1(async (req, res) => {
    const response = await User.login(req.body)
    res.onSuccess(response.data, response.code, response.msg)
}))
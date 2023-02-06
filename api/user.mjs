'use strict'


import express from "express";
import {handleWithoutAuth1} from "./middleware.mjs";
import {System, User} from "./stub.mjs";
import argon2i from "argon2";
import 'express-async-errors'

export const v1Router = express.Router()

const userRouter = express.Router()
v1Router.use('/user', userRouter)

function isFieldInvalid(field) {
    return (typeof field !== "string") || field.length === 0;
}

userRouter.post('/register', ...handleWithoutAuth1(async (req, res) => {
    function checkInput() {
        if (isFieldInvalid(req.body.phone)) {
            return -101
        }
        if (isFieldInvalid(req.body.password)) {
            return -102
        }
        return 0
    }

    const checkResult = checkInput()
    if (checkResult !== 0) {
        res.onFailed(checkResult, "参数错误")
        return
    }

    async function updateDb() {
        const encryptedPassword = await argon2i.hash(req.body.password)
        console.log(`encryptedPassword: ${encryptedPassword}`)

        const addResult = await User.addUser({
                phone: req.body.phone,
                password: encryptedPassword,
            }, {}
        )
        if (addResult.isError()) {
            console.log(addResult.toString())
            if (addResult.code === -100) {
                return -204
            } else {
                return -205
            }
        }
        return 0
    }

    const updateCode = await updateDb()
    if (updateCode !== 0) {
        if (updateCode === -204) {
            res.onFailed(updateCode, "用户名已存在")
        } else {
            res.onFailed(updateCode, "注册失败，请稍后重试")
        }
        return
    }

    // return {code: 0, msg: "注册成功", data: tokenResult.data}
    res.onSuccess({token: "token"})
}))

userRouter.post('/login', ...handleWithoutAuth1(async (req, res) => {
    function checkInput() {
        if (isFieldInvalid(req.body.phone)) {
            return -101
        }
        if (isFieldInvalid(req.body.password)) {
            return -102
        }
        return 0
    }

    const checkResult = checkInput()
    if (checkResult !== 0) {
        res.onFailed(checkResult, "参数错误")
        return
    }

    const userResult = await User.getUser(req.body.phone)
    if (userResult.isError()) {
        console.log(userResult.toString())
        res.onFailed(-201, "登录失败，请稍后重试")
        return
    }

    if (userResult.code === 1) {
        res.onFailed(-202, "用户名或密码错误")
        return
    }

    const user = userResult.data
    console.log(user)
    console.log(req.body.password)

    const matched = await argon2i.verify(user.password, req.body.password)
    if (!matched) {
        res.onFailed(-203, "用户名或密码错误")
        return
    }

    res.onSuccess({token: ""}, 0, "success")
}))
'use strict'

import express from "express";
import {handle} from "./middleware.mjs";
import 'express-async-errors'
import {MongoServerError} from "mongodb";

export const v1router = express.Router()
const userRouter = express.Router()
v1router.use('/user', userRouter)

userRouter.post("/add", ...handle(async (req, res) => {
    try {
        await req.context.mongo.db.collection("users")
            .insertOne({phone: req.body.phone, password: req.body.password})
        res.onSuccess({msg: "OK"})
    } catch (error) {
        if (error instanceof MongoServerError && error.code === 11000) {
            res.onFailed(-100, "user exists")
        } else {
            throw error;
        }
    }
}))

userRouter.get("/phone/:phone", ...handle(async (req, res) => {
    const user = await req.context.mongo.db.collection("users")
        .findOne({phone: req.params.phone})
    res.onSuccess(user)
}))
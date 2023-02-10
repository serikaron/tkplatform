'use strict'

import express from 'express'
import {handle} from "../../common/flow.mjs";
import {v1Router} from "./router.mjs";

const smsRouter = express.Router()
v1Router.use('/sms', smsRouter)



v1Router.post('/send', ...handle(async (req) => {
    const code = req.context.redis.get()
}))
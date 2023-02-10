'use strict'

import express from "express";
import {errorHandler, injection, responseHandler} from "../../common/flow.mjs";
import {redisContextDestructor, redisContextConstructor} from "../../common/redis.mjs";
import 'express-async-errors'
import {route as routeSend} from "./send.mjs";
import {route as routeVerify} from "./verify.mjs";


const app = express()
const port = 8080

app.use(express.json())

const router = express.Router()
app.use('/v1/sms', router)

router.use(injection)
router.use(redisContextConstructor)

routeSend(router)
routeVerify(router)

router.use(redisContextDestructor)
router.use(errorHandler)
router.use(responseHandler)


app.listen(port, () => {
    console.log('sms service start')
})
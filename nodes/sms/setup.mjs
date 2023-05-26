'use strict' //
// app.use(express.json())
//
import express from "express";
import {route as routeSend} from "./send.mjs";
import {route as routeVerify} from "./verify.mjs";

export function setup(app, {setup, teardown}) {
    const router = express.Router()
    app.use('/v1/sms', router)

    setup(router)

    routeSend(router)
    routeVerify(router)

    teardown(router)
}
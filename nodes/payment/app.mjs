'use strict'

import createApp from "../common/app.mjs";
import {setup} from "./setup.mjs";
import diContainer from "../common/dicontainer.mjs";
import {makeMiddleware} from "../common/flow.mjs";
import {cleanMongo, setupMongo} from "./mongo.mjs";
import setupAlipay from "./alipay.cjs";
import express from "express";

const app = createApp()

app.use(express.urlencoded())

setup(app, {
    setup: diContainer.setup(makeMiddleware([
        setupMongo,
        setupAlipay,
    ])),
    teardown: diContainer.teardown(makeMiddleware([
        cleanMongo
    ]))
})

app.listen(8080, () => {
    console.log("payment service started")
})
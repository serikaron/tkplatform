'use strict'

import express from "express";
import {TKResponse} from "../common/TKResponse.mjs";
import {replaceId} from "../common/utils.mjs";

export function setup(app, {setup, teardown}) {
    const router = express.Router()
    app.use("/v1/system", router)

    setup(router)

    router.get("/setting/:key", async (req, res, next) => {
        const dbRes = await req.context.mongo.get(req.params.key)
        res.response({
            data: dbRes === null ? {} : dbRes.value
        })
        next()
    })

    router.put("/setting", async (req, res, next) => {
        await req.context.mongo.set(req.body.key, req.body.value)
        res.response()
        next()
    })

    router.get('/settings', async (req, res, next) => {
        const dbRes = await req.context.mongo.getAll()
        res.response({
            data: dbRes === null ? {} : dbRes
        })
        next()
    })

    router.get('/questions', async (req, res, next) => {
        const l = await req.context.mongo.getQuestions()
        res.tkResponse(TKResponse.Success({
            data: l.map(replaceId)
        }))
        next()
    })

    router.get('/question/:questionId/answer', async (req, res, next) => {
        const a = await req.context.mongo.getAnswer(req.params.questionId)
        res.tkResponse(TKResponse.Success({
            data: a
        }))
        next()
    })

    teardown(router)
}




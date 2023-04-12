'use strict'
import {TKResponse} from "../common/TKResponse.mjs";
import {getValueNumber, replaceId} from "../common/utils.mjs";

export const routeQuestion = router => {
    router.get('/questions', async (req, res, next) => {
        const l = await req.context.mongo.getQuestions()
        res.tkResponse(TKResponse.Success({
            data: l.map(replaceId)
        }))
        next()
    })

    router.get('/backend/questions', async (req, res, next) => {
        const offset = getValueNumber(req.query.offset, "offset", 0)
        const limit = getValueNumber(req.query.limit, "limit", 1000)
        const l = await req.context.mongo.getQuestions(offset, limit)
        const c = await req.context.mongo.countQuestions()
        res.tkResponse(TKResponse.Success({
            data: {
                total: c,
                offset, limit,
                items: l.map(replaceId)
            }
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

    router.post('/question', async (req, res, next) => {
        const id = await req.context.mongo.addQuestion(q)
        res.tkResponse(TKResponse.Success({data: {id}}))
        next()
    })

    router.put('/question/:questionId', async (req, res, next) => {
        await req.context.mongo.updateQuestion(req.params.questionId, req.body)
        res.tkResponse(TKResponse.Success())
        next()
    })

    router.delete('/question/:questionId', async (req, res, next) => {
        await req.context.mongo.deleteQuestion(req.params.questionId)
        res.tkResponse(TKResponse.Success())
        next()
    })
}
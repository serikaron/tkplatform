'use restrict'

import {runTest} from "./service.mjs";
import {ObjectId} from "mongodb";
import {simpleVerification} from "./verification.mjs";

const baseURL = "http://localhost:9005"

test("questions", async () => {
    const userId = new ObjectId().toString()
    let questions = []

    await runTest({
        method: "GET",
        path: '/v1/system/questions',
        baseURL,
        userId,
        verify: rsp => {
            simpleVerification(rsp)
            questions = rsp.data
        }
    })

    for (const q of questions) {
        await runTest({
            method: "GET",
            path: `/v1/system/question/${q.id}/answer`,
            baseURL,
            userId,
            verify: rsp => {
                simpleVerification(rsp)
                console.log(rsp.data)
            }
        })
    }
})
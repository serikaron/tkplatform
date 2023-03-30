'use restrict'

import {ObjectId} from "mongodb";
import {runTest} from "./service.mjs";
import {simpleVerification} from "./verification.mjs";

const baseURL = "http://localhost:9008"

test("test invite point", async () => {
    const userId = `${new ObjectId()}`

    const add = async (howMany) => {
        await runTest({
            method: "POST",
            path: "/v1/wallet",
            body: {invitePoint: howMany},
            baseURL,
            userId,
            verify: rsp => {
                expect(rsp.status).toBe(200)
            }
        })
    }

    const check = async (wallet) => {
        await runTest({
            method: "GET",
            path: "/v1/wallet",
            baseURL,
            userId,
            verify: rsp => {
                simpleVerification(rsp)
                expect(rsp.data).toEqual(wallet)
            }
        })
    }

    await add(10)
    await check({
        cash: 0,
        rice: 0,
        invitePoint: 10,
    })
    await add(100)
    await check({
        cash: 0,
        rice: 0,
        invitePoint: 110
    })
})
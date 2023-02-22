'use restrict'

import {runTest} from "./service.mjs";
import {simpleVerification} from "./verification.mjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config()

const baseURL = "http://localhost:9001"

class Box {
    constructor() {
        this._id = undefined
    }

    get userId() {
        return this._id
    }

    set userId(id) {
        this._id = id
    }
}

describe("test user service", () => {
    const box = new Box()
    test("add user", async () => {
        await runTest({
            baseURL,
            method: "POST",
            path: "/v1/user/register",
            body: {
                phone: "13300000001",
                password: "123456",
                smsCode: "2065"
            },
            verify: response => {
                // simpleVerification(response)
                expect(response.status).toBe(201)
                expect(response.data.accessToken).not.toBeUndefined()
                const payload = jwt.verify(response.data.accessToken, process.env.SECRET_KEY, {
                    ignoreExpiration: true,
                    algorithm: "HS256"
                })
                box.userId = payload.id
            }
        })
    })

    test("get member", async () => {
        await runTest({
            baseURL,
            method: "GET",
            path: "/v1/user/member",
            userId: box.userId,
            verify: response => {
                simpleVerification(response)
                expect(response.data.expiration).not.toBeUndefined()
            }
        })
    })
})
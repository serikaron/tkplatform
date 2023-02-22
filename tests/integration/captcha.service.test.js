'use restrict'

import {runTest} from "./service.mjs";
import {simpleVerification} from "./verification.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {CaptchaError} from "../../common/errors/30000-sms-captcha.mjs";

const baseURL = "http://localhost:9003"

class Box {
    constructor() {
        this._key = undefined
        this._captcha = undefined
    }

    get key() {
        return this._key
    }

    set key(k) {
        this._key = k
    }
}

describe("test captcha service", () => {
    const box = new Box()

    test("require captcha", async () => {
        await runTest({
            baseURL,
            method: "POST",
            path: "/v1/captcha/require",
            verify: response => {
                simpleVerification(response)
                expect(response.data.image).not.toBeUndefined()
                box.key = response.data.key
            }
        })
    })

    test("verify captcha", async () => {
        await runTest({
            baseURL,
            method: "GET",
            path: `/v1/captcha/verify/${box.key}/error`,
            verify: response => {
                const tkResponse = TKResponse.fromError(new CaptchaError())
                expect(response.status).toBe(tkResponse.status)
                expect(response.code).toBe(tkResponse.code)
                expect(response.msg).toBe(tkResponse.msg)
            }
        })
    })
})
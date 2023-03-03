'use restrict'

import createApp from "../../common/app.mjs";
import {setup} from "../server.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {jest} from "@jest/globals"
import {TKResponse} from "../../common/TKResponse.mjs";
import {CodeError} from "../../common/errors/30000-sms-captcha.mjs";
import {InternalError, InvalidArgument, Unauthorized} from "../../common/errors/00000-basic.mjs";
import {VerifySmsCodeFailed} from "../../common/errors/10000-user.mjs";
import {genPhone} from "../../tests/common/utils.mjs";
import {ObjectId} from "mongodb";

const defaultBody = {
    old: {
        phone: "13333333333",
        password: "1234"
    },
    new: {
        phone: "14444444444",
        password: "2345"
    },
    smsCode: "1234"
}

const defaultHeaders = {
    id: "userId",
    phone: "13333333333",
}

const defaultDbUser = {
    _id: "userId",
    phone: "13333333333",
    password: "encodedOldPassword"
}

const defaultGetFn = async () => {
    return defaultDbUser
}

const defaultVerifyFn = async () => {
    return true
}

const defaultSmsFn = async () => {
    return TKResponse.Success()
}

const defaultResponseData = {
    accessToken: "accessToken",
    refreshToken: "refreshToken"
}

const defaultTokenFn = async () => {
    return TKResponse.Success({
        data: defaultResponseData
    })
}

const defaultEncodeFn = async () => {
    return "encodedNewPassword"
}

async function runTest(
    {
        body = defaultBody,
        headers = defaultHeaders,
        getFn = defaultGetFn,
        verifyFn = defaultVerifyFn,
        encodeFn = defaultEncodeFn,
        smsFn = defaultSmsFn,
        setFn = async () => {
        },
        tokenFn = defaultTokenFn,
        tkResponse,
    }) {
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        getUserById: getFn,
                        updateAccount: setFn,
                    },
                    password: {
                        verify: verifyFn,
                        encode: encodeFn
                    },
                    stubs: {
                        sms: {
                            verify: smsFn
                        },
                        token: {
                            gen: tokenFn,
                        }
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .post("/v1/user/account")
        .set(headers)
        .send(body)
    simpleCheckTKResponse(response, tkResponse)
}

describe("reset when after login", () => {
    describe.each([
        {
            name: "missing old sms",
            new: {phone: "14444444444", smsCode: "2345"},
        },
        {
            name: "missing new phone",
            old: {smsCode: "1234"},
            new: {smsCode: "2345"},
        },
        {
            name: "missing new sms",
            old: {smsCode: "1234"},
            new: {phone: "14444444444"},
        },
        {
            name: "invalid new phone",
            old: {smsCode: "1234"},
            new: {phone: "1111", smsCode: "2345"},
        },
    ])("body $name", (body) => {
        it("should return InvalidArgument", async () => {
            delete body.name
            await runTest({
                body,
                tkResponse: TKResponse.fromError(new InvalidArgument())
            })
        })
    })

    test("should check sms code", async () => {
        const smsFn = jest.fn(async () => {
            return TKResponse.fromError(new CodeError())
        })
        await runTest({
            smsFn,
            tkResponse: TKResponse.fromError(new VerifySmsCodeFailed())
        })
    })

    // test("should update db correctly", async () => {
    //     const updateAccount = jest.fn()
    //     const encode = jest.fn(async () => {
    //         return "encodedNewPassword"
    //     })
    //     await runTest({
    //         setFn: updateAccount,
    //         encodeFn: encode,
    //         status: 200, code: 0, msg: "更新成功", data: defaultResponseData
    //     })
    //     expect(updateAccount).toHaveBeenCalledWith(defaultHeaders.id, defaultBody.new.phone, "encodedNewPassword")
    //     expect(encode).toHaveBeenCalledWith(defaultBody.new.password)
    // })

    // test("token failed should return 401", async () => {
    //     const tokenFn = async () => {
    //         return TKResponse.fromError(new InternalError())
    //     }
    //
    //     await runTest({
    //         tokenFn,
    //         tkResponse: TKResponse.fromError(new Unauthorized())
    //     })
    // })

    // test("all well should return good", async () => {
    //     const userId = new ObjectId()
    //     const phone = genPhone()
    //     const getPassword = jest.fn(async () => {
    //         return {
    //             phone,
    //             password: "old password"
    //         }
    //     })
    //     const smsFn = jest.fn(async () => {
    //         return TKResponse.Success()
    //     })
    //     expect(getPassword).toHaveBeenCalledWith()
    // })
})

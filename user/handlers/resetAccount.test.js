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
import {ResetAccountFailed, UserNotExists, VerifySmsCodeFailed} from "../../common/errors/10000-user.mjs";
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
                        getPassword: getFn,
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
            body: {
                old: {smsCode: "1234"},
                new: {phone: genPhone(), smsCode: "2345"}
            },
            headers: {id: `${new ObjectId()}`},
            smsFn,
            tkResponse: TKResponse.fromError(new VerifySmsCodeFailed())
        })
    })

    test("user not found return 404", async () => {
        const getFn = async () => {
            return null
        }

        await runTest({
            body: {
                old: {smsCode: "1234"},
                new: {phone: genPhone(), smsCode: "2345"}
            },
            headers: {id: `${new ObjectId()}`},
            getFn,
            tkResponse: TKResponse.fromError(new UserNotExists())
        })
    })


    test("token failed should return 401", async () => {
        const tokenFn = async () => {
            return TKResponse.fromError(new InternalError())
        }

        await runTest({
            body: {
                old: {smsCode: "1234"},
                new: {phone: genPhone(), smsCode: "2345"}
            },
            headers: {id: `${new ObjectId()}`},
            tokenFn,
            tkResponse: TKResponse.fromError(new Unauthorized())
        })
    })

    test("all well should return good", async () => {
        const userId = new ObjectId()
        const phone = genPhone()
        const newPhone = genPhone()
        const getPassword = jest.fn(async () => {
            return {
                _id: userId,
                phone,
                password: "old password"
            }
        })
        const smsFn = jest.fn(async () => {
            return TKResponse.Success()
        })
        const updatePhone = jest.fn()
        const tokenFn = jest.fn(async () => {
            return TKResponse.Success({
                data: {
                    accessToken: "accessToken",
                    refreshToken: "refreshToken"
                }
            })
        })
        const checkPassword = jest.fn()

        await runTest({
            body: {
                old: {smsCode: "1234",},
                new: {phone: newPhone, smsCode: "2345"}
            },
            headers: {id: `${userId}`},
            getFn: getPassword,
            setFn: updatePhone,
            smsFn,
            tokenFn,
            verifyFn: checkPassword,
            tkResponse: TKResponse.Success({
                data: {
                    accessToken: "accessToken",
                    refreshToken: "refreshToken"
                }
            })
        })
        expect(getPassword).toHaveBeenCalledWith({userId: `${userId}`})
        expect(smsFn).toHaveBeenNthCalledWith(1, newPhone, "2345")
        expect(smsFn).toHaveBeenNthCalledWith(2, phone, "1234")
        expect(updatePhone).toHaveBeenCalledWith(userId, newPhone)
        expect(tokenFn).toHaveBeenCalledWith({id: `${userId}`, phone: newPhone})
        expect(checkPassword).toBeCalledTimes(0)
    })
})

describe("reset when before login", () => {
    const presetBody = {
        old: {phone: genPhone(), password: "123456",},
        new: {phone: genPhone(), smsCode: "1234"}
    }
    const presetHeaders = {}

    describe.each([
        {
            name: "missing old password",
            old: {phone: genPhone()},
            new: {phone: "14444444444", smsCode: "2345"},
        },
        {
            name: "missing old phone",
            old: {password: "123456"},
            new: {phone: "14444444444", smsCode: "2345"},
        },
        {
            name: "missing new phone",
            old: {phone: genPhone(), password: "123456"},
            new: {smsCode: "2345"},
        },
        {
            name: "missing new sms",
            old: {phone: genPhone(), password: "123456"},
            new: {phone: "14444444444"},
        },
        {
            name: "invalid new phone",
            old: {phone: genPhone(), password: "123456"},
            new: {phone: "1111", smsCode: "2345"},
        },
        {
            name: "invalid old phone",
            old: {password: "123456", phone: "123456"},
            new: {phone: "14444444444", smsCode: "2345"},
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
            body: presetBody,
            headers: presetHeaders,
            smsFn,
            tkResponse: TKResponse.fromError(new VerifySmsCodeFailed())
        })
    })

    test("user not found return 404", async () => {
        const getFn = async () => {
            return null
        }

        await runTest({
            body: presetBody,
            headers: presetHeaders,
            getFn,
            tkResponse: TKResponse.fromError(new UserNotExists())
        })
    })

    test("password not match should return failed", async () => {
        const verifyPassword = async () => {
            return false
        }

        await runTest({
            body: presetBody,
            headers: presetHeaders,
            verifyFn: verifyPassword,
            tkResponse: TKResponse.fromError(new ResetAccountFailed())
        })
    })

    // not token check before login

    test("all well should return good", async () => {
        const userId = new ObjectId()
        const getPassword = jest.fn(async () => {
            return {
                _id: userId,
                phone: presetBody.old.phone,
                password: "old password"
            }
        })
        const verifyPassword = jest.fn(async () => {
            return true
        })
        const smsFn = jest.fn(async () => {
            return TKResponse.Success()
        })
        const updatePhone = jest.fn()
        const tokenFn = jest.fn()

        await runTest({
            body: presetBody,
            headers: presetHeaders,
            getFn: getPassword,
            setFn: updatePhone,
            smsFn,
            tokenFn,
            verifyFn: verifyPassword,
            tkResponse: TKResponse.Success()
        })
        expect(getPassword).toHaveBeenCalledWith({phone: presetBody.old.phone})
        expect(smsFn).toHaveBeenNthCalledWith(1, presetBody.new.phone, presetBody.new.smsCode)
        expect(updatePhone).toHaveBeenCalledWith(userId, presetBody.new.phone)
        expect(verifyPassword).toHaveBeenCalledWith("old password", presetBody.old.password)
        expect(tokenFn).toBeCalledTimes(0)
    })
})

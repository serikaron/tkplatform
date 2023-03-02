'use restrict'

import createApp from "../../common/app.mjs";
import {setup} from "../server.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckResponse, simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {jest} from '@jest/globals'
import {InvalidArgument} from "../../common/errors/00000-basic.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {genPhone} from "../../tests/common/utils.mjs";
import {ObjectId} from "mongodb";
import argon2i from "argon2";
import {UserNotExists} from "../../common/errors/10000-user.mjs";

const userId = new ObjectId()
const phone = genPhone()
const oldPassword = '$argon2id$v=19$m=65536,t=3,p=4$4yOMJ8LoIFOwQBF9nWdhaw$na32PVqwpmlDN59601iA5y6GGdH7iX406oQPIqF3CoI\n'

const headersWithId = (userId) => {
    return userId === undefined ? {} : {id: `${userId}`}
}
const bodyWithPhone = (phone) => {
    return {
        smsCode: "1234", newPassword: "123456",
        phone: phone
    }
}

const defaultGetFn = async () => {
    return {
        phone: phone,
        password: oldPassword
    }
}

const defaultSmsFn = async () => {
    return TKResponse.Success()
}

const defaultResponseData = {
    accessToken: "accessToken",
    refreshToken: "refreshToken"
}

async function runTest(
    {
        headers = {},
        body,
        getFn = defaultGetFn,
        smsFn = defaultSmsFn,
        setFn = async () => {
        },
        encodeFn = async (newPassword) => {
            return await argon2i.hash(newPassword)
        },
        verifyFn = async (serverPassword, clientPassword) => {
            return await argon2i.verify(serverPassword, clientPassword)
        },
        tokenFn = async () => {
            return TKResponse.Success({data: defaultResponseData})
        },
        tkResponse,
    }
) {
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        getPassword: getFn,
                        getUserByPhone: getFn,
                        updatePassword: setFn
                    },
                    stubs: {
                        sms: {
                            verify: smsFn
                        },
                        token: {
                            gen: tokenFn
                        }
                    },
                    password: {
                        encode: encodeFn,
                        verify: verifyFn
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .post("/v1/user/password")
        .send(body)
        .set(headers)
    simpleCheckTKResponse(response, tkResponse)
}

describe.each([
    {smsCode: "1234", phone: "13333333333"},
    {newPassword: "123456", phone: "13333333333"},
    {smsCode: "1234", newPassword: "123456"},
    {phone: "1222", smsCode: "1234", newPassword: "123456"}
])("($#) invalid body", (body) => {
    it.concurrent("should return InvalidArgument", async () => {
        await runTest({
            body,
            tkResponse: TKResponse.fromError(new InvalidArgument())
        })
    })
})


test("sms code check failed should return InvalidArgument", async () => {
    const smsFn = jest.fn(async () => {
        return TKResponse.fromError(new InvalidArgument())
    })
    await runTest({
        smsFn,
        status: 400, code: -10006, msg: "验证码错误"
    })
    expect(smsFn).toHaveBeenCalledWith("13333333333", "1234")
})

test("password should be encoded and save to db", async () => {
    const updatePassword = jest.fn()
    const encodeFn = jest.fn(async () => {
        return "encodedPassword"
    })
    await runTest({
        setFn: updatePassword,
        encodeFn,
        status: 200, code: 0, msg: "更新成功"
    })
    expect(updatePassword).toHaveBeenCalledWith("13333333333", "encodedPassword")
    expect(encodeFn).toHaveBeenCalledWith("123456")
})

describe.each([
    {
        userId: new ObjectId()
    },
    {
        phone: genPhone()
    }
])("($#) from different entry", () => {
    it("user not found from db", async () => {
        const getPassword = jest.fn(async () => {
            return null
        })
        await runTest({
            headers: headersWithId(userId),
            body: bodyWithPhone(phone),
            getFn: getPassword,
            tkResponse: TKResponse.fromError(new UserNotExists())
        })
        if (userId !== undefined) {
            expect(getPassword).toHaveBeenCalledWith({userId: `${userId}`})
        } else {
            expect(getPassword).toHaveBeenCalledWith({phone: phone})
        }
    })
    const checkPassword = jest.fn
})
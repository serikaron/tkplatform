'use restrict'

import createApp from "../../common/app.mjs";
import {setup} from "../server.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {jest} from '@jest/globals'
import {InvalidArgument} from "../../common/errors/00000-basic.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {genPhone} from "../../tests/common/utils.mjs";
import {ObjectId} from "mongodb";
import {PasswordNotMatch, UserNotExists, VerifySmsCodeFailed} from "../../common/errors/10000-user.mjs";

const presetUserId = new ObjectId()
const presetPhone = genPhone()

const headersWithId = (userId) => {
    return userId === undefined ? {} : {id: `${userId}`}
}
const bodyWithPhone = (phone, oldPassword) => {
    return {
        smsCode: "1234", oldPassword: oldPassword, newPassword: "123456",
        phone: phone
    }
}

async function runTest(
    {
        headers = {},
        body,
        getFn = async () => {
            return {
                phone: presetPhone,
                password: "encodedOldPassword"
            }
        },
        smsFn = async () => {
            return TKResponse.Success()
        },
        setFn = async () => {
        },
        encodeFn = async () => {
        },
        verifyFn = async () => {
            return true
        },
        tokenFn = async () => {
            return TKResponse.Success({
                data: {
                    accessToken: "accessToken",
                    refreshToken: "refreshToken"
                }
            })
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

describe.each([true, false])("login %s", (hasBeenLogin) => {
    const userId = hasBeenLogin ? new ObjectId() : undefined
    const oldPassword = hasBeenLogin ? "12345" : undefined
    const phone = hasBeenLogin ? undefined : genPhone()
    const headers = headersWithId(userId)
    const body = bodyWithPhone(phone, oldPassword)

    describe("invalid bodies", () => {
        const invalidBodies = hasBeenLogin ? [
            {smsCode: "1234", oldPassword: "12345"},
            {newPassword: "123456", oldPassword: "12345"},
            {smsCode: "1234", newPassword: "123456"},
        ] : [
            {smsCode: "1234", phone: "13333333333"},
            {newPassword: "123456", phone: "13333333333"},
            {smsCode: "1234", newPassword: "123456"},
            {phone: "1222", smsCode: "1234", newPassword: "123456"}
        ]
        it.concurrent.each(invalidBodies)("($#) should return InvalidArgument", async (invalidBody) => {
            await runTest({
                headers,// disable userId input to check all body situations
                body: invalidBody,
                tkResponse: TKResponse.fromError(new InvalidArgument())
            })
        })
    })

    it("user not found from db should return failed", async () => {
        const getPassword = jest.fn(async () => {
            return null
        })
        await runTest({
            headers,
            body,
            getFn: getPassword,
            tkResponse: TKResponse.fromError(new UserNotExists())
        })
    })

    it("password not match should return failed", async () => {
        const checkPassword = async () => {
            return false
        }
        await runTest({
            headers,
            body,
            verifyFn: checkPassword,
            // should only check using userId
            tkResponse: hasBeenLogin ?
                TKResponse.fromError(new PasswordNotMatch()) :
                TKResponse.Success()
        })
    })

    test("sms code check failed should return InvalidArgument", async () => {
        const smsFn = jest.fn(async () => {
            return TKResponse.fromError(new InvalidArgument())
        })
        await runTest({
            headers,
            body,
            smsFn,
            tkResponse: TKResponse.fromError(new VerifySmsCodeFailed())
            // status: 400, code: -10006, msg: "验证码错误"
        })
    })

    test("all goes well should return good", async () => {
        const dbRes = {
            _id: hasBeenLogin ? userId : presetUserId,
            phone: hasBeenLogin ? presetPhone : phone,
            password: "oldEncodedPassword"
        }
        const getPassword = jest.fn(async () => {
            return dbRes
        })
        const checkPassword = jest.fn(async () => {
            return true
        })
        const smsFn = jest.fn(async () => {
            return TKResponse.Success()
        })
        const encodePassword = jest.fn(async () => {
            return "encodedNewPassword"
        })
        const dbFn = jest.fn()

        await runTest({
            headers,
            body,
            getFn: getPassword,
            smsFn: smsFn,
            setFn: dbFn,
            encodeFn: encodePassword,
            verifyFn: checkPassword,
            tkResponse: TKResponse.Success()
        })

        if (userId !== undefined) {
            expect(getPassword).toHaveBeenCalledWith({userId: headers.id})
            expect(checkPassword).toHaveBeenCalledWith(dbRes.password, body.oldPassword)
        } else {
            expect(getPassword).toHaveBeenCalledWith({phone: body.phone})
        }
        expect(smsFn).toHaveBeenCalledWith(dbRes.phone, body.smsCode)
        expect(encodePassword).toHaveBeenCalledWith(body.newPassword)
        expect(dbFn).toHaveBeenCalledWith(dbRes._id, "encodedNewPassword")
    })
})
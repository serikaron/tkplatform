'use restrict'

import {jest} from "@jest/globals";
import createApp from "../../common/app.mjs";
import {setup} from "../server.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {ObjectId} from "mongodb";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {AlreadyIdentified, IdentifyFailed} from "../../common/errors/10000-user.mjs";
import dotenv from "dotenv";

dotenv.config()

const successRsp = {
    "name": "张三",
    "idNo": "340421190710145412",
    "respMessage": "身份证信息匹配",
    "respCode": "0000",
    "province": "安徽省",
    "city": "淮南市",
    "county": "凤台县",
    "birthday": "19071014",
    "sex": "M",
    "age": "111"
}

const failedRsp = {
    "name": "李四",
    "idNo": "340421190710145412",
    "respMessage": "身份证信息不匹配",
    "respCode": "0008",
    "province": "安徽省",
    "city": "淮南市",
    "county": "凤台县",
    "birthday": "19071014",
    "sex": "M",
    "age": "111"
}

test("already identified", async () => {
    const getUserById = jest.fn(async () => {
        return {
            identification: {}
        }
    })

    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        getUserById
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const userId = new ObjectId()
    const response = await supertest(app)
        .post('/v1/user/identification')
        .send({})
        .set({id: userId.toString()})

    simpleCheckTKResponse(response, TKResponse.fromError(new AlreadyIdentified()))
    expect(getUserById).toHaveBeenCalledWith(userId.toString())
})

test('aliyun return failed', async () => {
    const getUserById = jest.fn(async () => {
        return {}
    })
    const identify = jest.fn(async () => {
        return failedRsp
    })

    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    aliyun: {
                        identify
                    },
                    mongo: {
                        getUserById
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const userId = new ObjectId()
    const response = await supertest(app)
        .post('/v1/user/identification')
        .send({
            idNo: "123456",
            name: "name"
        })
        .set({id: userId.toString()})

    simpleCheckTKResponse(response, TKResponse.fromError(new IdentifyFailed()))
    expect(identify).toHaveBeenCalledWith(process.env.ALIYUN_APP_CODE, "123456", "name")
    expect(getUserById).toHaveBeenCalledWith(userId.toString())
})

test('ailyun return success', async () => {
    const identify = jest.fn(async () => {
        return successRsp
    })
    const updateIdentification = jest.fn()
    const getUserById = jest.fn(async () => {
        return {
            contact: {
                qq: {
                    account: "",
                    open: true
                },
                wechat: {
                    account: "",
                    open: false
                }
            }
        }
    })

    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    aliyun: {
                        identify
                    },
                    mongo: {
                        updateIdentification,
                        getUserById
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const userId = new ObjectId()
    const response = await supertest(app)
        .post('/v1/user/identification')
        .send({
            idNo: "123456",
            name: "name",
            wechat: "wechat",
            qq: "qq",
            image: "url"
        })
        .set({id: userId.toString()})

    simpleCheckTKResponse(response, TKResponse.Success())
    expect(identify).toHaveBeenCalledWith(process.env.ALIYUN_APP_CODE, "123456", "name")
    expect(updateIdentification).toHaveBeenCalledWith(userId.toString(), {
        identification: {
            idNo: "340421190710145412",
            name: "张三",
            image: "url"
        },
        "contact.qq.account": "qq",
        "contact.wechat.account": "wechat"
    })
    expect(getUserById).toHaveBeenCalledWith(userId.toString())
})
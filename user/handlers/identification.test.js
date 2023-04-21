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
    "error_code": 0,/*当error_code为0 通过不通过isok值判断*/
    "reason": "Success",
    "result": {
        "realname": "张*", /*用户传递上来真实姓名脱敏返回*/
        "idcard": "3303***********", /*用户传递上来IdcardNo的脱敏返回*/
        "isok": true
        /*true：匹配 false：不匹配*/,
        "IdCardInfor": {
            "province": "浙江省",
            "city": "杭州市",
            "district": "xx县",
            "area": "浙江省杭州市区xx县",
            "sex": "男",
            "birthday": "1965-3-10"
        }
    }
}

const failedRsp = {
    "error_code": 206501,
    "reason": "NoExistERROR",
    "result": {"realname": "2*******", "idcard": "1****", "isok": false, "IdCardInfor": null}
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

test.only('ailyun return success', async () => {
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
            idNo: "123456",
            name: "name",
            image: "url"
        },
        "contact.qq.account": "qq",
        "contact.wechat.account": "wechat"
    })
    expect(getUserById).toHaveBeenCalledWith(userId.toString())
})
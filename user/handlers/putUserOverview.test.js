'use restrict'

import {jest} from "@jest/globals";
import createApp from "../../common/app.mjs";
import {setup} from "../server.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {ObjectId} from "mongodb";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

describe.each([
    {
        body: {},
    },
    {
        body: {
            name: "a name",
            invalidField: "should not update",
            contact: {
                phone: {
                    account: "14444444444"
                }
            }
        },
        update: {
            name: "a name",
        }
    },
    {
        body: {
            name: "a name",
            contact: {
                qq: {
                    account: "123",
                    open: true
                },
                wechat: {
                    account: "144",
                    open: true
                },
                phone: {
                    open: true
                }
            }
        },
        update: {
            name: "a name",
            "contact.qq.account": "123",
            "contact.qq.open": true,
            "contact.wechat.account": "144",
            "contact.wechat.open": true,
            "contact.phone.open": true,
        }
    }
])("($#) update according to body", ({body, update}) => {
    test("update user information", async () => {
        const updateOverview = jest.fn()

        const app = createApp()
        setup(app, {
            setup: testDIContainer.setup([
                (req, res, next) => {
                    req.context = {
                        mongo: {
                            updateOverview
                        }
                    }
                    next()
                }
            ]),
            teardown: testDIContainer.teardown([])
        })

        const userId = new ObjectId()
        const response = await supertest(app)
            .put('/v1/user/overview')
            .set({id: `${userId}`})
            .send(body)

        simpleCheckTKResponse(response, TKResponse.Success())
        if (update !== undefined) {
            expect(updateOverview).toHaveBeenCalledWith(`${userId}`, update)
        }
    })
})

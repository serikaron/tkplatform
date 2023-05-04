'use restrict'

import {jest} from "@jest/globals";
import createApp from "../../common/app.mjs";
import {setup} from "../server.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {ObjectId} from "mongodb";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

test.each([
    {
        name: "identified",
        dbRes: {
            identification: {
                idNo: "123",
                name: "abc",
                image: "url"
            },
            contact: {
                wechat: {account: "wechat"},
                qq: {account: "qq"}
            }
        },
        tkRes: {
            identified: true,
            identification: {
                idNo: "123",
                name: "abc",
                image: "url",
                wechat: "wechat",
                qq: "qq"
            }
        }
    },
    {
        name: "not identified",
        dbRes: {
            contact: {
                wechat: {account: "wechat"},
                qq: {account: "qq"}
            }
        },
        tkRes: {identified: false}
    }
])
("$name", async ({dbRes, tkRes}) => {
    const getUserById = jest.fn(async () => {
        return dbRes
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
        .get('/v1/user/identification')
        .set({id: userId.toString()})

    simpleCheckTKResponse(response, TKResponse.Success({
        data: tkRes
    }))
    expect(getUserById).toHaveBeenCalledWith(userId.toString())
})


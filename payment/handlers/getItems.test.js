"use restrict"

import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import {jest} from "@jest/globals";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

describe.each([
    {
        path: "/v1/member/items",
        items: [{msg: "a fake member item"}],
        memberFn: jest.fn(async () => {
            return [{msg: "a fake member item"}]
        })
    },
    {
        path: "/v1/rice/items",
        items: [{msg: "a fake rice item"}],
        riceFn: jest.fn(async () => {
            return [{msg: "a fake rice item"}]
        })
    }
])("$path", ({path, items, memberFn, riceFn}) => {
    test("should return items from db", async () => {
        const app = createApp()
        setup(app, {
            setup: testDIContainer.setup([
                (req, res, next) => {
                    req.context = {
                        mongo: {
                            getMemberItems: memberFn,
                            getRiceItems: riceFn,
                        }
                    }
                    next()
                }
            ]),
            teardown: testDIContainer.teardown([])
        })

        const response = await supertest(app)
            .get(path)
        simpleCheckTKResponse(response, TKResponse.Success({
            data: items
        }))

        if (memberFn !== undefined) {
            expect(memberFn).toHaveBeenCalled()
        }
        if (riceFn !== undefined) {
            expect(riceFn).toHaveBeenCalled()
        }
    })
})

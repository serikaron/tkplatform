'use restrict'

import {jest} from "@jest/globals";
import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {ObjectId} from "mongodb";

test("call db fn to add", async () => {
    const id = new ObjectId()
    const addSite = jest.fn(async () => {
        return id
    })

    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        addSite
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .post("/v1/site")
        .send({msg: "site body"})

    simpleCheckTKResponse(response, TKResponse.Success({
        data: {
            id: id.toString()
        }
    }))
    expect(addSite).toHaveBeenCalledWith({msg: "site body"})
})
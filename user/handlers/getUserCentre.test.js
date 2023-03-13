'use restrict'

import {jest} from "@jest/globals";
import {genPhone} from "../../tests/common/utils.mjs";
import createApp from "../../common/app.mjs";
import {setup} from "../server.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {ObjectId} from "mongodb";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {now} from "../../common/utils.mjs";

test("combine all information and return", async () => {
    const memberExpiration = now()
    const userId = new ObjectId()
    const phone = genPhone()
    const getUserCentre = jest.fn(async () => {
        return {
            _id: userId,
            phone,
            member: {
                expiration: memberExpiration
            }
        }
    })

    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        getUserCentre,
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    const response = await supertest(app)
        .get("/v1/user/centre")
        .set({id: `${userId}`})

    simpleCheckTKResponse(response, TKResponse.Success({
        data: {
            id: `${userId}`,
            phone,
            member: {
                expiration: memberExpiration
            },
            identified: false,
            notice: [],
            wallet: {
                cash: 0,
                rice: 0,
            }
        }
    }))
    expect(getUserCentre).toHaveBeenCalledWith(`${userId}`)
})
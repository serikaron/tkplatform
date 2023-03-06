'use restrict'

import {ObjectId} from "mongodb";
import {jest} from "@jest/globals";
import createApp from "../../common/app.mjs";
import {setup} from "../setup.mjs";
import testDIContainer from "../../tests/unittest/dicontainer.mjs";
import supertest from "supertest";
import {simpleCheckTKResponse} from "../../tests/unittest/test-runner.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";

const defaultTemplate = (id, i) => {
    return {
        id,
        "name": `通用设置${i+1}`,
        "account": true,
        "taskId": false,
        "store": true,
        "ledgerAccount": true,
        "shop": true,
        "product": false,
        "journalAccount": false,
        "refund": {
            "from": false,
            "type": false
        },
        "received": false,
        "status": true,
        "screenshot": false,
        "comment": true
    }
}

const getDefaultTemplates = (ids) => {
    return ids.map(defaultTemplate)
}

const runTest = async (
    {
        userId,
        addTemplates,
        getTemplates,
    }
) => {
    const app = createApp()
    setup(app, {
        setup: testDIContainer.setup([
            (req, res, next) => {
                req.context = {
                    mongo: {
                        addTemplates,
                        getTemplates
                    }
                }
                next()
            }
        ]),
        teardown: testDIContainer.teardown([])
    })

    return await supertest(app)
        .get('/v1/ledger/templates')
        .set({id: `${userId}`})
}

test("add default templates when not found", async () => {
    const addTemplates = jest.fn()
    const getTemplates = jest.fn(async () => {
        return null
    })
    const userId = new ObjectId()

    const response = await runTest({
        userId,
        addTemplates,
        getTemplates,
    })

    const newIds = response.body.data.map(x => x.id)
    const newTemplates = getDefaultTemplates(newIds)
    const templatesToAdd = getDefaultTemplates(
        newIds.map(x => new ObjectId(x))
    )

    simpleCheckTKResponse(response, TKResponse.Success({
        data: newTemplates
    }))
    expect(addTemplates).toHaveBeenCalledWith(`${userId}`, templatesToAdd)
    expect(getTemplates).toHaveBeenCalledWith(`${userId}`)
})

test("return templates when found", async () => {
    const templates = getDefaultTemplates([1,2,3,4,5].map(_ => `${new ObjectId()}`))
    const getTemplates = jest.fn(async () => {
        return {templates}
    })
    const userId = new ObjectId()

    const response = await runTest({
        userId,
        addTemplates: null,
        getTemplates,
    })

    simpleCheckTKResponse(response, TKResponse.Success({
        data: templates
    }))
    expect(getTemplates).toHaveBeenCalledWith(`${userId}`)
})


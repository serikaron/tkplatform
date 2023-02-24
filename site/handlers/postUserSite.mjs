'use strict'

import {TKResponse} from "../../common/TKResponse.mjs";
import {isBadFieldString, replaceId} from "../../common/utils.mjs";
import {InvalidArgument, NotFound} from "../../common/errors/00000-basic.mjs";
import {ObjectId} from "mongodb";
import {makeMiddleware} from "../../common/flow.mjs";

const checkInput = (req) => {
    if (isBadFieldString(req.body.siteId)) {
        throw new InvalidArgument()
    }
    try {
        req.siteId = new ObjectId(req.body.siteId)
    } catch (e) {
        throw new InvalidArgument()
    }
}

const makeUserSite = async req => {
    const systemSite = await req.context.mongo.getSite(req.siteId)
    if (systemSite === null) {
        throw new NotFound({msg: "站点不存在"})
    }
    systemSite.id = systemSite._id
    delete systemSite._id
    req.userSite = {
        userId: new ObjectId(req.headers.id),
        site: systemSite,
        "credential": {
            "account": "",
            "password": ""
        },
        "verified": false,
        "account": {
            "list": []
        },
        "setting": {
            "interval": {
                "min": 200,
                "max": 300,
            },
            "schedule": [
                {
                    "from": "",
                    "to": "",
                },
                {
                    from: "",
                    to: ""
                }
            ]
        }
    }
}

const addUserSite = async (req, res) => {
    await req.context.mongo.addUserSite(req.userSite)
    delete req.userSite.userId
    replaceId(req.userSite)
    res.tkResponse(TKResponse.Success({
        data: req.userSite
    }))
}

export function routePostUserSite(router) {
    router.post('/user/site', ...makeMiddleware([
        checkInput,
        makeUserSite,
        addUserSite
    ]))
}
'use strict'

import {NotFound} from "../../common/errors/00000-basic.mjs";
import {TKResponse} from "../../common/TKResponse.mjs";
import {makeMiddleware} from "../../common/flow.mjs";

const getUserSite = async (req) => {
    const userSite = await req.context.mongo.getUserSite(req.params.userSiteId, req.headers.id)
    if (userSite === null) {
        throw new NotFound()
    }

    req.userSite = userSite
}

const sync = async (req) => {
    const update = {}

    if (req.body.hasOwnProperty("interval")
        && req.body.interval.hasOwnProperty("sync")
        && req.body.interval.sync === 1
    ) {
        update["setting.interval"] = req.userSite.setting.interval
    }

    if (req.body.hasOwnProperty("schedule")
        && Array.isArray(req.body.schedule)
    ) {
        for (let i = 0; i < req.userSite.setting.schedule.length; ++i) {
            if (i === req.body.schedule.length) {
                break
            }

            const x = req.body.schedule[i]
            if (x.hasOwnProperty("sync")) {
                switch (x.sync) {
                    case 1:
                        update[`setting.schedule.${i}.from`] = req.userSite.setting.schedule[i].from
                        update[`setting.schedule.${i}.to`] = req.userSite.setting.schedule[i].to
                        update[`setting.schedule.${i}.activated`] = req.userSite.setting.schedule[i].activated
                        break;
                    case 2:
                        update[`setting.schedule.${i}.from`] = req.userSite.setting.schedule[i].from
                        update[`setting.schedule.${i}.to`] = req.userSite.setting.schedule[i].to
                        break;
                }
            }
        }
    }

    if (update !== {}) {
        await req.context.mongo.syncSettings(req.headers.id, req.userSite.site.id, update)
    }
}

const send = async (req, res) => {
    res.tkResponse(TKResponse.Success())
}

export const routeSyncSettings = router => {
    router.put('/user/site/:userSiteId/setting/sync', makeMiddleware([
        getUserSite,
        sync,
        send
    ]))
}
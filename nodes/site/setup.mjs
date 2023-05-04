'use strict'

import express from "express";
import {routeGetSite} from "./handlers/getSites.mjs";
import {routePostUserSite} from "./handlers/postUserSite.mjs";
import {routeGetUserSites} from "./handlers/getUserSites.mjs";
import {routePutUserSite} from "./handlers/putUserSite.mjs";
import {routeGetUserSite} from "./handlers/getUserSite.mjs";
import {routeGetSitesBalance} from "./handlers/getUserSitesBalance.mjs";
import {routePutUserSiteBalance} from "./handlers/putUserSiteBalance.mjs";
import {routePostUserSiteJournalEntry} from "./handlers/postUserSiteJournalEntry.mjs";
import {routeGetUserSiteJournalEntries} from "./handlers/getUserSiteJournalEntries.mjs";
import {routeCountUserSites} from "./handlers/countUserSites.mjs";
import {routeDelUserSite} from "./handlers/delUserSite.mjs";
import {routeGetSitesStatistics} from "./handlers/getSitesStatistics.mjs";
import {routeGetSiteLogs} from "./handlers/getSiteLogs.mjs";
import {routePostSiteLogs} from "./handlers/postSiteLogs.mjs";
import {routeSyncSettings} from "./handlers/syncSettings.mjs";
import {routeAddReport} from "./handlers/addReport.mjs";
import {routeGetProblemTemplates} from "./handlers/getProblemTemplates.mjs";
import {routeAddMissing} from "./handlers/addMissing.mjs";
import {routeGetMissing} from "./handlers/getMissing.mjs";
import {routeAddSite} from "./handlers/addSite.mjs";
import {routePutSite} from "./handlers/putSite.mjs";

export function setup(app, {setup, teardown}) {
    const router = express.Router()
    app.use("/v1", router)

    setup(router)

    routeGetSite(router)
    routePostUserSite(router)
    routeGetUserSites(router)
    routePutUserSite(router)
    routeGetUserSite(router)
    routeGetSitesBalance(router)
    routePutUserSiteBalance(router)
    routePostUserSiteJournalEntry(router)
    routeGetUserSiteJournalEntries(router)
    routeCountUserSites(router)
    routeDelUserSite(router)
    routeGetSitesStatistics(router)
    routeGetSiteLogs(router)
    routePostSiteLogs(router)
    routeSyncSettings(router)
    routeAddReport(router)
    routeGetProblemTemplates(router)
    routeAddMissing(router)
    routeGetMissing(router)
    routeAddSite(router)
    routePutSite(router)

    teardown(router)
}
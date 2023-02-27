'use strict'

import express from "express";
import {routeGetEntries} from "./handlers/getEntries.mjs";
import {routeGetStores} from "./handlers/getStores.mjs";
import {routeGetAccounts} from "./handlers/getAccounts.mjs";
import {routeGetUserAccounts} from "./handlers/getUserAccounts.mjs";
import {routePostUserAccount} from "./handlers/postUserAccount.mjs";
import {routePutUserAccount} from "./handlers/putUserAccount.mjs";
import {routeGetSiteRecords} from "./handlers/getSiteRecords.mjs";
import {routePostSiteRecord} from "./handlers/postSiteRecord.mjs";
import {routePutSiteRecord} from "./handlers/putSiteRecord.mjs";
import {routePostEntry} from "./handlers/postEntry.mjs";
import {routePutEntry} from "./handlers/putEntry.mjs";
import {routeGetEntry} from "./handlers/getEntry.mjs";
import {routeGetLedgerStatistics} from "./handlers/getLedgerStatistics.mjs";
import {routeGetJournalStatistics} from "./handlers/getJournalStatistics.mjs";

export function setup(app, {setup, teardown}) {
    const router = express.Router()
    app.use("/v1", router)

    setup(router)

    routePostEntry(router)
    routePutEntry(router)
    routeGetEntries(router)
    routeGetEntry(router)
    routeGetStores(router)
    routeGetAccounts(router)
    routeGetUserAccounts(router)
    routePostUserAccount(router)
    routePutUserAccount(router)
    routeGetSiteRecords(router)
    routePostSiteRecord(router)
    routePutSiteRecord(router)
    routeGetLedgerStatistics(router)
    routeGetJournalStatistics(router)

    teardown(router)
}
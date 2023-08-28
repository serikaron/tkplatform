'use strict'

import express from "express";
import {routeGetItems} from "./handlers/getItems.mjs";
import {routeGetWallet} from "./handlers/getWallet.mjs";
import {routePostWallet} from "./handlers/postWallet.mjs";
import {routeGetWalletDetail} from "./handlers/getWalletDetail.mjs";
import {routeGetWalletOverview} from "./handlers/getWalletOverview.mjs";
import {routePay} from "./handlers/pay.mjs";
import {routeAlipayCallback} from "./handlers/alipayCallback.mjs";
import {routeCheckPayLog} from "./handlers/checkPayLog.mjs";
import {routeGetRecords} from "./handlers/getRecords.mjs";
import {routeWithdraw} from "./handlers/withdraw.mjs";
import {routeAuditWithdrawal} from "./handlers/auditWithdrawal.mjs";
import {routeAddBackendRecord} from "./handlers/addBackendRecord.mjs";
import {routeGetWithdrawRecords} from "./handlers/getWithdrawRecords.mjs";

export function setup(app, {setup, teardown}) {
    const router = express.Router()
    app.use("/v1", router)

    setup(router)

    routeGetItems(router)
    routeGetWallet(router)
    routePostWallet(router)
    routeGetWalletDetail(router)
    routeGetWalletOverview(router)

    teardown(router)

    const routerV2 = express.Router()
    app.use("/v2", routerV2)
    setup(routerV2)
    routePay(routerV2)
    routeAlipayCallback(routerV2)
    routeCheckPayLog(routerV2)
    routeGetRecords(routerV2)
    routeWithdraw(routerV2)
    routeAuditWithdrawal(routerV2)
    routeAddBackendRecord(routerV2)
    routeGetWithdrawRecords(routerV2)
    teardown(routerV2)
}
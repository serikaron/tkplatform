'use strict'

import express from "express";
import {route as routeRegister} from "./handlers/register.mjs";
import {route as routeLogin} from "./handlers/login.mjs"
import {route as routeResetPassword} from "./handlers/resetPassword.mjs"
import {route as routeResetAccount} from "./handlers/resetAccount.mjs"
import {routeGetUserMember} from "./handlers/getUserMember.mjs";
import {routeGetUserOverview} from "./handlers/getUserOverview.mjs";
import {routePutUserOverview} from "./handlers/putUserOverview.mjs";
import {routeGetDownLines} from "./handlers/getDownLines.mjs";
import {routePutUserDownLine} from "./handlers/putDownLine.mjs";
import {routeGetUserCentre} from "./handlers/getUserCentre.mjs";
import {routeBackendLogin} from "./handlers/backendLogin.mjs";
import {routeBackendRegister} from "./handlers/backendRegister.mjs";
import {routeClaimDownLinePrice} from "./handlers/claimDownLinePrice.mjs";
import {routeBackendGetUser} from "./handlers/backendGetUser.mjs";
import {routeGetReportTypes} from "./handlers/getReportTypes.mjs";
import {routePostReport} from "./handlers/postReport.mjs";
import {routeGetReports} from "./handlers/getReports.mjs";
import {routeGetReport} from "./handlers/getReport.mjs";
import {routeBackendGetUsers} from "./handlers/backendGetUsers.mjs";
import {routeGetMessages} from "./handlers/getMessages.mjs";
import {routePostMessage} from "./handlers/postMessage.mjs";
import {routePutMessage} from "./handlers/putMessage.mjs";
import {routeDelMessage} from "./handlers/delMessage.mjs";
import {routePutMessages} from "./handlers/putMessages.mjs";
import {routeDelMessages} from "./handlers/delMessages.mjs";
import {routeIdentification} from "./handlers/identification.mjs";
import {routeGetIdentification} from "./handlers/getIdentification.mjs";
import {routeBackendPutReport} from "./handlers/backendPutReport.mjs";
import {routeAddUserMember} from "./handlers/addUserMember.mjs";

export function setup(app, {
    setup, teardown
} = {}) {
    const router = express.Router()
    app.use('/v1', router)
    setup(router)
    routeRegister(router)
    routeLogin(router)
    routeResetPassword(router)
    routeResetAccount(router)
    routeGetUserMember(router)
    routeGetUserOverview(router)
    routePutUserOverview(router)
    routeGetDownLines(router)
    routePutUserDownLine(router)
    routeGetUserCentre(router)
    routeClaimDownLinePrice(router)
    routeGetReportTypes(router)
    routePostReport(router)
    routeGetReports(router)
    routeGetReport(router)
    routeGetMessages(router)
    routePostMessage(router)
    routePutMessage(router)
    routePutMessages(router)
    routeDelMessage(router)
    routeDelMessages(router)
    routeIdentification(router)
    routeGetIdentification(router)
    routeAddUserMember(router)

    routeBackendLogin(router)
    routeBackendRegister(router)
    routeBackendGetUser(router)
    routeBackendGetUsers(router)
    routeBackendPutReport(router)

    teardown(router)
}

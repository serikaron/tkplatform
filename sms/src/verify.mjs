'use strict'

import {handle} from "../../common/flow.mjs";
import {smsRouter} from "./router.mjs";

function checkArgument() {}

smsRouter.get('/verify', ...handle(async (req) => {
    const code = req.context.redis.get()
}))
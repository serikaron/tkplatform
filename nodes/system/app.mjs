'use strict'

import createApp from "../common/app.mjs";
import dicontainer from "../common/dicontainer.mjs";
import {makeMiddleware} from "../common/flow.mjs";
import {cleanMongo, setupMongo} from "./mongo.mjs";
import {setup} from "./setup.mjs";

const app = createApp()

setup(app, {
    setup: dicontainer.setup(makeMiddleware([
        setupMongo
    ])),
    teardown: dicontainer.teardown(makeMiddleware([
        cleanMongo
    ]))
})

app.listen(8080, () => {
    console.log("system service started")
})
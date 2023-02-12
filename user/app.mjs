'use strict'

import 'express-async-errors'
import createApp from "../common/app.mjs";
import {setup} from "./server.mjs";
import diContainer from "../common/dicontainer.mjs";
import {makeMiddleware} from "../common/flow.mjs";
import {cleanMongo, setupMongo} from "./mongo.mjs";
import {setupStub} from "./stubs.mjs";

const app = createApp()
setup(app, {
        setup: diContainer.setup(
            makeMiddleware([
                setupMongo, setupStub
            ])
        ),
        teardown: diContainer.teardown(
            makeMiddleware([
                cleanMongo
            ])
        )
    }
)

app.listen(8080, () => {
    console.log('user service started')
});
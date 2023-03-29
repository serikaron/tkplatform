'use strict'

import createApp from "../common/app.mjs";
import diContainer from "../common/dicontainer.mjs";
import {checkSign, checkTime, tokenContext} from "./middleware.mjs";
import {setup} from "./setup.mjs";
import {dispatchContext} from "./dispatcher.mjs";

const app = createApp()

setup(app, {
    setup: diContainer.setup([
        dispatchContext,
        tokenContext,
        checkTime,
        checkSign,
    ]),
    teardown: diContainer.teardown([])
})


app.listen(8080, () => {
    console.log('api service started')
});
'use strict'

import createApp from "../common/app.mjs";
import diContainer from "../common/dicontainer.mjs";
import {checkSign, checkTime} from "./middleware.mjs";
import {setup} from "./setup.mjs";

const app = createApp()

setup(app, {
    setup: diContainer.setup([
        checkTime,
        checkSign,
    ]),
    teardown: diContainer.teardown([])
})


app.listen(8080, () => {
    console.log('api service started')
});
'use strict'

import createApp from "../common/app.mjs";
import diContainer from "../common/dicontainer.mjs";
import {checkPrivilege, checkSign, checkTime, tokenContext} from "./middleware.mjs";
import {setup} from "./setup.mjs";
import {dispatchContext} from "./dispatcher.mjs";
import cors from 'cors'

const app = createApp()

app.use(cors({origin: "*"}))

setup(app, {
    setup: diContainer.setup([
        dispatchContext,
        tokenContext,
        checkTime,
        checkSign,
        checkPrivilege,
    ]),
    teardown: diContainer.teardown([])
})

app.listen(8080, () => {
    console.log('api service started')
});
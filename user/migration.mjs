'use strict'

import {close, connect} from "./mongo.mjs";

const mongo = await connect()
await mongo.db.collection("users").createIndex({phone: 1}, {unique: true, name: "idx_users_phone"})
await close(mongo.client)
'use strict'

import {MongoClient} from 'mongodb'
import * as dotenv from 'dotenv'

dotenv.config()

export async function connect() {
    const uri = `mongodb://${process.env.MONGO_USER_USER}:${process.env.MONGO_USER_PASS}@${process.env.MONGO_USER_HOST}:27017`
    const client = new MongoClient(uri)
    await client.connect()
    return {
        client,
        db: client.db(process.env.MONGO_USER_DB)
    }
}

export async function close(client) {
    await client.close()
}
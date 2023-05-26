'use strict'

import {MongoClient} from "mongodb";

export async function integrationConnectMongo(dbName, port) {
    const uri = `mongodb://tk${dbName}:tk${dbName}@localhost:${port}`
    console.log(`connecting ${dbName} db`)
    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db(`tk${dbName}`)
    return {client, db}
}
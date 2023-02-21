'use strict'


import fs from 'fs'
import path from 'path'
import * as dotenv from 'dotenv'
import {connectLedger, connectSite, connectSystem, connectUser} from "../common/mongo.mjs";

dotenv.config()

async function callFiles(mongoClient) {
    const directory = "/app/migration"
    const methodName = "migrate"
    const version = "version"
    const files = fs.readdirSync(directory)

    for (const file of files) {
        if (file !== 'migration.mjs'
            && (path.extname(file) === '.js' || path.extname(file) === '.mjs')
        ) {
            const filePath = path.join(directory, file)
            const module = await import(filePath);
            if (typeof module[methodName] === 'function' &&
                typeof module[version] === 'string'
            ) {
                await doMigrate(mongoClient, filePath, module[version], module[methodName])
            }
        }
    }
}

async function getMigrationVersion(mongoClient) {
    const version = await mongoClient.system.db
        .collection("migrations")
        .find()
        .sort({ver: -1})
        .limit(1)
        .toArray()
    return version.length === 0 ? null : version[0]
}

async function addMigration(mongoClient, version) {
    await mongoClient.system.db
        .collection("migrations")
        .insertOne({
            ver: version,
            at: Math.floor(Date.now() / 1000)
        })
}

async function doMigrate(mongoClient, filePath, version, migrateFn) {
    console.log(`migrating version:${version} file:${filePath}`)
    const dbRes = await getMigrationVersion(mongoClient)
    const lastVersion = dbRes === null ? null : dbRes.ver

    if (lastVersion !== null && version <= lastVersion) {
        console.log(`skip migrate version ${version}`)
        return
    }

    await migrateFn(mongoClient)

    console.log(`migration done version:${version} file:${filePath}`)
    await addMigration(mongoClient, version)
}

const mongoClient = {
    user: await connectUser(),
    system: await connectSystem(),
    site: await connectSite(),
    leger: await connectLedger(),
}

await callFiles(mongoClient)

for (const key in mongoClient) {
    mongoClient[key].client.close()
}

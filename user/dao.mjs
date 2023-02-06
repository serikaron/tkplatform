'use strict'
import mysqlx from '@mysql/xdevapi'

export const pool = mysqlx.getClient(dsnFromArgv(), {
    pooling: {
        enabled: true,
        maxSize: 10,
        maxIdleTime: 20000,
        queueTimeout: 5000
    }
})

function dsnFromArgv() {
    const args = process.argv.slice(2)
    if (args.length < 1) {
        console.log("should start with db arguments")
        process.exit(1)
    }
    return args[0]
}

export async function begin(ctx) {
    return await ctx.session.begin
}

export async function commit(ctx) {
    return await ctx.session.commit()
}

export async function rollback(ctx) {
    return await ctx.session.rollback()
}

export async function insertUser(ctx, name, password, uuid, days, device) {
    return await ctx.session
        .sql("INSERT INTO users (name, password, uuid, deadline, device) VALUES (?, ?, ?, now()+interval ? day, ?)")
        .bind(name, password, uuid, days, device)
        .execute()
}

export async function updateDeadline(ctx, uuid, days) {
    return await ctx.session
        .sql("UPDATE users set deadline=IF(deadline>now(), deadline, now()) + interval ? day WHERE uuid=? and deleted=0")
        .bind(days, uuid)
        .execute()
}

function resultToUser(r) {
    const one = r.fetchOne()
    if (one === undefined) {
        return undefined
    }
    const columns = r.getColumns().map(x => x.getColumnLabel())
    return one.map((x, i) => [columns[i], x])
        .reduce(
            (prev, curr) => {
                prev[curr[0]] = curr[1]
                return prev
            },
            {})
}

export async function selectUserByName(ctx, name) {
    const r = await ctx.session
        .sql("SELECT name,password,uuid,UNIX_TIMESTAMP(deadline) as deadline FROM users WHERE name=? and deleted=0")
        .bind(name)
        .execute()
    return resultToUser(r)
}

export async function selectUserByUUID(ctx, uuid) {
    const r = await ctx.session
        .sql("SELECT name,password,uuid,UNIX_TIMESTAMP(deadline) as deadline FROM users WHERE uuid=? and deleted=0")
        .bind(uuid)
        .execute()
    return resultToUser(r)
}

export async function countByDevice(ctx, device) {
    const r = await ctx.session
        .sql("SELECT COUNT(*) FROM users WHERE device=?")
        .bind(device)
        .execute()
    return r.fetchOne()[0]
}

export async function insertRelation(ctx, pUUID, cUUID) {
    return await ctx.session
        .sql("INSERT INTO relations (p_uuid, c_uuid) VALUES (?, ?) ON DUPLICATE KEY UPDATE id=id")
        .bind(pUUID, cUUID)
        .execute()
}
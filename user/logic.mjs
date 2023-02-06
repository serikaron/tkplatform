'use strict'

import {
    begin,
    commit,
    countByDevice,
    insertRelation,
    insertUser,
    rollback,
    selectUserByName,
    selectUserByUUID,
    updateDeadline
} from "./dao.mjs";

export async function addUser(ctx, user, inviter) {
    try {
        console.log(user)
        console.log(inviter)
        await begin(ctx)
        await insertUser(ctx, user.name, user.password, user.uuid, user.days, user.deviceId)
        if ("uuid" in inviter) {
            await insertRelation(ctx, inviter.uuid, user.uuid)
            if ("days" in inviter) {
                await updateDeadline(ctx, inviter.uuid, inviter.days)
            }
        }
        await commit(ctx)
        return {
            code: 0, msg: "success"
        }
    } catch (e) {
        console.log(`add user failed: ${e}`)
        await rollback(ctx)
        const regex = ".*Duplicate entry.*users.name'$"
        if (e.toString().match(regex)) {
            return {
                code: -100, msg: "user exists"
            }
        } else {
            return {
                code: -200, msg: "add user failed"
            }
        }
    }
}

export async function countDevice(ctx, device) {
    try {
        const count = await countByDevice(ctx, device)
        return {
            code: 0, msg: "success", data: {count}
        }
    } catch (e) {
        console.log(`count device failed: ${e}`)
        return {
            code: -100, msg: "count failed"
        }
    }
}

export async function getUserByName(ctx, name) {
    return await getUser(() => {
        return selectUserByName(ctx, name)
    })
}

async function getUser(fn) {
    try {
        const r = await fn()
        return (r === undefined) ?
            {code: 1, msg: "not found"} :
            {code: 0, msg: "success", data: r}
    } catch (e) {
        console.log(`get user failed: ${e}`)
        return {
            code: -100, msg: "get failed"
        }
    }
}

export async function getUserByUUID(ctx, uuid) {
    return await getUser(() => {
        return selectUserByUUID(ctx, uuid)
    })
}
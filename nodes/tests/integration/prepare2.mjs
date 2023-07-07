'use strict'

import {getUserCentre, login, register} from "./user.mjs";
import fs from "fs/promises";
import {genPhone} from "../common/utils.mjs";
import {adminLogin, adminRegister} from "./backend.mjs";

const saveToken = async (defaultToken, upLine1, upLine2, upLine3, adminToken) => {
    const fileData = `'use strict'
export const token = {
    default: {accessToken: '${defaultToken}'},
    upLine1: {accessToken: '${upLine1}'},
    upLine2: {accessToken: '${upLine2}'},
    upLine3: {accessToken: '${upLine3}'},
    upLines: [
        {accessToken: '${upLine1}'},
        {accessToken: '${upLine2}'},
        {accessToken: '${upLine3}'},
    ],
    adminToken: {accessToken: '${adminToken}'},
}
    `
    await fs.writeFile('./nodes/tests/integration/token.mjs', fileData)
}

// try {
//     await saveToken(await login("13333333333"))
// } catch {
//     await saveToken(await register("13333333333"))
// }

const createUser = async (phone, inviterToken) => {
    const registerUser = async () => {
        let invitor = undefined
        if (inviterToken !== undefined) {
            const r = await getUserCentre({accessToken: inviterToken})
            invitor = r.id
        }
        return await register(phone, invitor)
    }

    try {
        return await login(phone)
    } catch {
        return await registerUser()
    }
}

const prepareUser = async () => {
    const phoneList = [
        genPhone(),
        genPhone(),
        genPhone(),
        genPhone(),
    ]

    const tokenList = []
    for (let i = 0; i < phoneList.length; ++i) {
        const phone = phoneList[i]
        const inviterToken= i === 0 ? undefined : tokenList[i - 1]
        const token = await createUser(phone, inviterToken)
        tokenList.push(token)
    }

    return tokenList
}

const prepareAdmin = async () => {
    const username = "admin-12345"
    try {
        return await adminLogin(username)
    } catch {
        return await adminRegister(username)
    }
}

const prepare = async () => {
    const tokenList = await prepareUser()
    const adminToken = await prepareAdmin()
    await saveToken(tokenList[3], tokenList[2], tokenList[1], tokenList[0], adminToken)
}

await prepare()
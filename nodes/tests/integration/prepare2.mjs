'use strict'

import {login, register} from "./user.mjs";
import fs from "fs/promises";

const saveToken = async (token) => {
    const fileData = `'use strict'
export const token = {
    default: {accessToken: '${token}'}
}
    `
    await fs.writeFile('./nodes/tests/integration/token.mjs', fileData)
}

try {
    await saveToken(await login("13333333333"))
} catch {
    await saveToken(await register("13333333333"))
}
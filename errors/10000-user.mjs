'use strict'

import {TKError} from "./error.mjs";

const codeBase = -10000

export class UserExists extends TKError {
    constructor({code = codeBase - 1, msg = "用户已存在"} = {}) {
        super({
            status: 409,
            code: code,
            msg: msg
        });
    }
}

export class UserNotExists extends TKError {
    constructor({code = codeBase -2, msg = "用户不存在"} = {}) {
        super({
            status: 404,
            code: code,
            msg: msg
        });
    }
}
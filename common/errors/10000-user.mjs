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
    constructor({code = codeBase - 2, msg = "用户不存在"} = {}) {
        super({
            status: 404,
            code: code,
            msg: msg
        });
    }
}

export class PasswordNotMatch extends TKError {
    constructor({code = codeBase - 3} = {}) {
        super({
            status: 403,
            code: code,
            msg: "用户名或密码错误"
        });
    }
}

export class LoginFailed extends TKError {
    constructor({code = codeBase - 4, msg = "登录失败"} = {}) {
        super({
            status: 500,
            code: code,
            msg: msg
        })
    }
}
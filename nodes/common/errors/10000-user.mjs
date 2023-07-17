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

export class RegisterFailed extends TKError {
    constructor() {
        super({
            status: 500,
            code: codeBase - 5,
            msg: "注册失败"
        });
    }
}

export class VerifySmsCodeFailed extends TKError {
    constructor() {
        super({
            status: 400,
            code: codeBase - 6,
            msg: "验证码错误"
        });
    }
}

export class ResetAccountFailed extends TKError {
    constructor() {
        super({
            status: 400,
            code: codeBase - 7,
            msg: "更新失败"
        });
    }
}

export class IdentifyFailed extends TKError {
    constructor() {
        super({
            status: 400,
            code: codeBase - 8,
            msg: "实名认证失败"
        });
    }
}

export class AlreadyIdentified extends TKError {
    constructor() {
        super({
            status: 400,
            code: codeBase - 9,
            msg: "已经实名认证"
        });
    }
}

export class HaveNotIdentified extends TKError {
    constructor() {
        super({
            status: 400,
            code: codeBase - 10,
            msg: "还未实名认证"
        });
    }
}
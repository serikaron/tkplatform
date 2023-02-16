'use strict'
import {TKError} from "./error.mjs";

const codeBase = 0
export class InvalidArgument extends TKError {
    constructor({code = codeBase - 1, msg = ""} = {}) {
        const m = msg === "" ? "" : `(${msg})`
        super({
            status: 400,
            code: code,
            msg: `参数错误${m}`
        })
    }
}

export class InternalError extends TKError {
    constructor() {
        super({
            status: 500,
            code: codeBase - 2,
            msg: "内部错误"
        });
    }
}

export class UnknownError extends TKError {
    constructor() {
        super({
            status: 500,
            code: codeBase - 3,
            msg: "未知错误"
        });
    }
}

export class NeedAuth extends TKError {
    constructor() {
        super({
            status: 401,
            code: codeBase - 4,
            msg: "请先登录"
        });
    }
}
'use strict'

export class UserError extends Error {
    constructor({httpCode, code, msg}) {
        super(msg);
        this.httpCode = httpCode
        this.code = code
    }
}

export class InvalidArgument extends UserError {
    constructor({code = -100, msg = ""} = {}) {
        const m = msg === "" ? "" : `(${msg})`
        super({
            httpCode: 400,
            code: code,
            msg: `参数错误${m}`
        })
    }
}
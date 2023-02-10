'use strict'

export class TKError extends Error {
    constructor({httpCode, code, msg}) {
        super(msg);
        this.httpCode = httpCode
        this.code = code
    }
}

export class InvalidArgument extends TKError {
    constructor({code = -100, msg = ""} = {}) {
        const m = msg === "" ? "" : `(${msg})`
        super({
            httpCode: 400,
            code: code,
            msg: `参数错误${m}`
        })
    }
}
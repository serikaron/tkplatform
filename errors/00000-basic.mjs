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
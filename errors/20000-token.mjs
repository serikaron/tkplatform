'use strict'

import {TKError} from "./error.mjs";

const codeBase = -10000

export class GenToken extends TKError {
    constructor({code = codeBase - 1, msg = "生成失败"} = {}) {
        super({
            status: 500,
            code: code,
            msg: msg
        });
    }
}

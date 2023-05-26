'use strict'
import {TKError} from "./error.mjs";

const codeBase = -30000
export class InvalidCaptcha extends TKError {
    constructor() {
        super({
            status: 400,
            code: codeBase - 1,
            msg: "图形验证码错误"
        });
    }
}

export class SendSmsFailed extends TKError {
    constructor() {
        super({
            status: 500,
            code: codeBase - 2,
            msg: "发送短信失败"
        });
    }
}

export class CodeError extends TKError {
    constructor() {
        super({
            status: 400,
            code: codeBase - 3,
            msg: "验证码错误"
        });
    }
}

export class CaptchaError extends TKError {
    constructor() {
        super({
            status: 400,
            code: codeBase - 4,
            msg: "图形码错误"
        });
    }
}
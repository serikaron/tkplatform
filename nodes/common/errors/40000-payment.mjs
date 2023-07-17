'use strict'

import {TKError} from "./error.mjs";

const codeBase = -40000

export class NotEnoughRice extends TKError {
    constructor() {
        super({
            status: 400,
            code: codeBase - 1,
            msg: "米粒不足"
        });
    }
}

export class ItemNotFound extends TKError {
    constructor() {
        super({
            status: 400,
            code: codeBase - 2,
            msg: "物品不存在"
        });
    }
}

export class AlipayCallback extends TKError {
    constructor(msg) {
        super({
            status: 500,
            code: codeBase - 3,
            msg
        });
    }
}

export class DidNotPay extends TKError {
    constructor(msg) {
        super({
            status: 400,
            code: codeBase - 4,
            msg
        });
    }
}

export class NotEnoughCash extends TKError {
    constructor() {
        super({
            status: 400,
            code: codeBase - 5,
            msg: "余额不足"
        });
    }
}
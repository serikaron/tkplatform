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
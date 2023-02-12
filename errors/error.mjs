'use strict'

export class TKError extends Error {
    constructor({status, code, msg}) {
        super(msg);
        this.status = status
        this.code = code
    }
}


'use strict'

export class TKError extends Error {
    constructor({status, code, msg}) {
        super(msg);
        this._status = status
        this._code = code
    }

    get status() {
        return this._status
    }

    get code() {
        return this._code
    }
}


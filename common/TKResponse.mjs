'use strict'

export class TKResponse {
    constructor(status, res) {
        this._status = status
        this.res = res
    }

    isSuccess() {
        return this.res.code >= 0
    }

    isError() {
        return !this.isSuccess()
    }

    get status() {
        return this._status
    }

    get code() {
        return Number(this.res.code)
    }

    get msg() {
        return "msg" in this.res ? this.res.msg : ""
    }

    get data() {
        return "data" in this.res ? this.res.data : {}
    }

    toString() {
        return JSON.stringify(this.res)
    }

    static Success({data = {}} = {}) {
        return new TKResponse(200, {
            code: 0, msg: "success", data
        })
    }

    static fromError(tkError) {
        return new TKResponse(tkError.status, {
            code: tkError.constructor, msg: tkError.message
        })
    }
}

'use strict'

export class Response {
    constructor(res) {
        this.res = res
    }

    isSuccess() {
        return this.res.code >= 0
    }

    isError() {
        return !this.isSuccess()
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
}
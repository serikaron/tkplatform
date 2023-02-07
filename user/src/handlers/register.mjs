'use strict'

import {userRouter} from "../router.mjs";
import {handle} from "../middleware.mjs";
import {InvalidArgument, UserError} from "../error.mjs";

class UserExists extends UserError {
    constructor({code = -100} = {}) {
        super({
            httpCode: 409,
            code: code,
            msg: "用户已存在"
        });
    }
}

function checkInput(req) {
    function isBadField(field) {
        return (typeof field !== "string") || field.length === 0;
    }

    if (isBadField(req.body.phone)) {
        throw new InvalidArgument({code: -100, msg: "phone"})
    }
    if (isBadField(req.body.password)) {
        return new InvalidArgument({code: -101, msg: "password"})
    }
}

async function checkUserExist(req) {
    const result = await req.context.mongo.db.collection("users")
        .findOne({phone: req.body.phone}, {_id: 1})
    if (result !== null) {
        throw new UserExists()
    }
}


// userRouter.post('/register1', ...handle(async (req, res) => {
    // const checkResult = checkInput({})
    // if (checkResult !== 0) {
    //     res.onFailed(checkResult, "参数错误")
    //     return
    // }
    //
    // if (!isUserExist(req.context, req.body.phone)) {
    //     res.onFailed(-100, "error")
    // } else {
    //     res.onSuccess({})
    // }
// }))

userRouter.post('/register', ...handle([
    checkInput,
    checkUserExist
]))

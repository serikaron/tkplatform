'use strict'

import {userRouter} from "../router.mjs";
import {handle} from "../middleware.mjs";
import {InvalidArgument, UserError} from "../error.mjs";
import {getUser} from "../dao.mjs";
import {MongoServerError} from "mongodb";
import {Token} from "../stubs.mjs";

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

async function getInviter(req) {
    if (req.body.inviter !== undefined) {
        req.inviter = await getUser(req.context, req.body.inviter)
    }
}

async function addUser({context, user, inviter}) {
    const handlerError = (error) => {
        if (error instanceof MongoServerError && error.code === 11000) {
            throw new UserExists()
        } else {
            throw error;
        }
    }

    const withoutInviter = async () => {
        try {
            await context.mongo.db.collection("users")
                .insertOne(user)
        } catch (error) {
            handlerError(error)
        }
    }

    const withInviter = async () => {
        const session = context.mongo.client.startSession()
        session.startTransaction()
        try {
            await context.mongo.db.collection("users")
                .insertOne(user)
            await context.mongo.db.collection("users")
                .updateOne({phone: inviter.phone},
                    {$set: {member: inviter.member, downLines: inviter.downLines}})
            await session.commitTransaction()
        } catch (error) {
            await session.abortTransaction()
            handlerError(error)
        } finally {
            session.endSession()
        }
    }

    if (inviter === undefined) {
        await withoutInviter()
    } else {
        await withInviter()
    }
}

async function registerHandler(req) {
    const result = register({
        registerUser: {
            phone: req.body.phone, password: req.body.password
        },
        inviter: req.inviter,
        config: {
            daysForRegister: 7,
            daysForInvite: 3
        }
    })

    await addUser({
        context: req.context,
        user: result.registerUser,
        inviter: result.inviter
    })
}

async function genToken(req, res) {
    const result = await Token.generate({phone: req.body.phone})
    if (!result.isSuccess()) {
        res.response({
            code: -101,
            msg: "注册成功，请重新登录"
        })
    } else {
        res.response({
            data: result.data
        })
    }
}

userRouter.post('/register', ...handle([
    checkInput,
    checkUserExist,
    getInviter,
    registerHandler,
    genToken
]))

function todayTimestamp() {
    return Math.floor(new Date(new Date().toISOString().slice(0, 10).replaceAll("-", "/")).getTime() / 1000)
}

export function register({registerUser, inviter, config}) {
    registerUser.member = {
        expiration: todayTimestamp() + config.daysForRegister * 86400
    }

    if (inviter === undefined) {
        return {
            registerUser
        }
    }

    registerUser.upLine = inviter.phone
    if (inviter.downLines === undefined) {
        inviter.downLines = [registerUser.phone]
    } else {
        inviter.downLines.push(registerUser.phone)
    }
    const baseline = Math.max(inviter.member.expiration, todayTimestamp())
    inviter.member.expiration = baseline + config.daysForInvite * 86400
    return {
        registerUser, inviter
    }
}
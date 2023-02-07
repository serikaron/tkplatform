'use strict'



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

    const baseline = Math.max(inviter.member.expiration, todayTimestamp())
    inviter.member.expiration = baseline + config.daysForInvite * 86400
    return {
        registerUser, inviter
    }
}
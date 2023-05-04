'use strict'

const privileges = {
    admin: 0,
    user: 1,
    finance: 2,
    site: 3,
    system: 4,
}

export const privilegeMap = {
    "GET-/backend/v1/user/:userId": privileges.user,
    "GET-/backend/v1/users": privileges.user,
    "POST-/backend/v1/user/message": privileges.user,
}
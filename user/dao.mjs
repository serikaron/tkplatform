'use strict'


export async function getUser(context, phone) {
    return await context.mongo.db.collection("users")
        .findOne({phone: phone}, {phone: 1, member: 1})
}
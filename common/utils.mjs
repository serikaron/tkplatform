'use strict'

export function isBadFieldString(field) {
    return (typeof field !== "string") || field.length === 0;
}

export function isBadFiledObject(field) {
    return (field === null) || (typeof field !== "object") || Object.keys(field).length === 0
}

export function isBadFieldBool(field) {
    return (typeof field !== "boolean");
}

export function isGoodFieldBool(field) {
    return !isBadFieldBool(field)
}

export function isBadPhone(phoneNumber) {
    const pattern = /^(?:\+86)?1[3-9]\d{9}$/;
    return !pattern.test(phoneNumber);
}

export function now() {
    return Math.floor(Date.now() / 1000)
}

export function today() {
    const now = new Date(); // get the current date and time
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // set the time to 00:00:00
    return startOfToday.getTime(); // get the timestamp in milliseconds
}
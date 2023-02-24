'use strict'

export function isBadFieldString(field) {
    return (typeof field !== "string") || field.length === 0;
}

export function isBadFieldObject(field) {
    return (field === null) || (typeof field !== "object") || Object.keys(field).length === 0
}

export function isBadFieldBool(field) {
    return (typeof field !== "boolean");
}

export function isBadFieldNumber(field) {
    return (typeof field !== "number")
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
    return Math.floor(startOfToday.getTime() / 1000); // get the timestamp in milliseconds
}

export function dateRange(
    minDate, maxDate,
    {
        defaultMinDate = now() - 86400,
        defaultMaxDate = now()
    } = {}
) {
    const parse = (i, d) => {
        const n = Number(i)
        return isNaN(n) ? d : n
    }
    const numMinDate = parse(minDate, defaultMinDate)
    const numMaxDate = parse(maxDate, defaultMaxDate)
    return {
        minDate: Math.min(numMinDate, numMaxDate),
        maxDate: Math.max(numMinDate, numMaxDate)
    }
}

export function replaceId(obj) {
    obj.id = obj._id
    delete obj._id
    return obj
}

export function copy(obj) {
    return JSON.parse(JSON.stringify(obj))
}
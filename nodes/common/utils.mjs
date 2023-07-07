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

export function isTimestamp(timestamp) {
    return new Date(timestamp).getTime() > 0
}

export function now() {
    return Math.floor(Date.now() / 1000)
}

export function today() {
    const now = new Date(); // get the current date and time
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // set the time to 00:00:00
    return Math.floor(startOfToday.getTime() / 1000); // get the timestamp in milliseconds
}

export function parseDate(dateString) {
    return Math.floor(new Date(dateString).getTime() / 1000)
}

export function dateToTimestamp(year, month, day) {
    return parseDate(`${year}/${month}/${day}`)
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
    // return JSON.parse(JSON.stringify(obj))
    if (Array.isArray(obj)) {
        return obj.slice()
    }
    if (typeof obj === "object") {
        return Object.assign({}, obj)
    }
    return obj
}

export function flattenObject(obj, prefix = "") {
    return Object.keys(obj).reduce((acc, key) => {
        const pre = prefix.length ? prefix + "." : "";
        if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
            Object.assign(acc, flattenObject(obj[key], pre + key));
        } else {
            acc[pre + key] = obj[key];
        }
        return acc;
    }, {});
}

export function mergeObjects(base, update) {
    for (const key in update) {
        if (typeof update[key] === "object" && update[key] !== null) {
            if (!(key in base)) {
                base[key] = {};
            }
            mergeObjects(base[key], update[key]);
        } else {
            base[key] = update[key];
        }
    }
    return base;
}

export const getValueNumber = (dict, key, def) => {
    if (dict === undefined) {
        return def
    }

    if (!dict.hasOwnProperty(key)) {
        return def
    }

    const out = Number(dict[key])
    return isNaN(out) ? def : out
}

export const getValueString = (dict, key, def) => {
    return dict.hasOwnProperty(key) ? dict[key] : def
}

export const base64Encode = (str) => {
    return new Buffer(str).toString('base64')
}

export const base64Decode = (str) => {
    return new Buffer(str, 'base64').toString()
}

export const isTestEnv = () => {
    return process.env.hasOwnProperty("TEST_ENV") && process.env.TEST_ENV === "1"
}

export const isReleaseEnv = () => {
    return !isTestEnv()
}
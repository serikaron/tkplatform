'use strict'

export function isBadFieldString(field) {
    return (typeof field !== "string") || field.length === 0;
}

export function isBadPhone(phoneNumber) {
    const pattern = /^(?:\+86)?1[3-9]\d{9}$/;
    return !pattern.test(phoneNumber);
}
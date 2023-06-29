'use strict'

export const pendingStatus = 0
export const isPendingStatus = (status) => {
    return status === pendingStatus
}

export const failedStatus= 1
export const isFailedStatus = (status) => {
    return status === failedStatus
}

export const payedStatus= 2
export const isPayedStatus = (status) => {
    return status === payedStatus
}

export const completedStatus= 3
export const isCompletedStatus = (status) => {
    return status === completedStatus3
}
'use strict'

import {ObjectId} from "mongodb";

export const version = "0015"

export async function migrate(mongoClient) {
    await mongoClient.system.db
        .collection("settings")
        .insertMany([
            {
                key: "minimalWithdraw",
                value: 10000,
            },
            {
                key: "upLineCommission",
                value: 0.1,
            },
            {
                key: "claimDownLinePrice",
                value: 10,
            }
        ])
    await mongoClient.payment.db
        .collection("commissionSetting")
        .insertMany([
            {
                _id: new ObjectId("644390b7514f55501eb7c647"),
                commissionType: 1,
                level: 1,
                peopleNumber: 0,
                rate: 5,
                rate1: 30,
                rate2: 20,
                rate3: 10
            },
            {
                _id: new ObjectId("644390c7514f55501eb7c649"),
                commissionType: 2,
                level: 2,
                peopleNumber: 10,
                rate: 5
            },
            {
                _id: new ObjectId("644390d5514f55501eb7c64b"),
                commissionType: 2,
                level: 3,
                peopleNumber: 20,
                rate: 8
            }
        ])
}
'use strict'

export const version = "0011"

export async function migrate(mongoClient) {
    await mongoClient.payment.db
        .collection("memberItems")
        .insertMany([
            {
                name: "VIP周卡",
                days: 7,
                price: 10,
                originalPrice: 10,
                promotion: false
            },
            {
                name: "VIP月卡",
                days: 30,
                price: 30,
                originalPrice: 30,
                promotion: false
            },
            {
                name: "VIP季卡",
                days: 90,
                price: 85.5,
                originalPrice: 90,
                promotion: true
            },
            {
                name: "VIP月卡",
                days: 180,
                price: 162,
                originalPrice: 180,
                promotion: true
            },
            {
                name: "VIP年卡",
                days: 360,
                price: 288,
                originalPrice: 360,
                promotion: true
            },
        ])
    await mongoClient.payment.db
        .collection('riceItems')
        .insertMany([
            {
                name: "30天米粒",
                rice: 450,
                price: 45,
                originPrice: 45,
                promotion: false
            },
            {
                name: "90天米粒",
                rice: 1350,
                price: 128,
                originPrice: 135,
                promotion: true
            },
            {
                name: "180天米粒",
                rice: 2700,
                price: 240,
                originPrice: 270,
                promotion: true
            },
        ] )
}
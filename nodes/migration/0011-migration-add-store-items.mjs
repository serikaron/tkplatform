'use strict'

import {ObjectId} from "mongodb";

export const version = "0011"

export async function migrate(mongoClient) {
    await mongoClient.payment.db
        .collection("memberItems")
        .insertMany([{
            _id: new ObjectId("642f925807fdf4a11a3fbaf5"),
            name: 'VIP周卡',
            days: 7,
            price: 1000,
            originalPrice: 1000,
            promotion: false
        }, {
            _id: new ObjectId("642f92b407fdf4a11a3fbaf8"),
            name: 'VIP月卡',
            days: 30,
            price: 3000,
            originalPrice: 3000,
            promotion: false
        }, {
            _id: new ObjectId("642f92f307fdf4a11a3fbafa"),
            name: 'VIP季卡',
            days: 90,
            price: 8500,
            originalPrice: 9000,
            promotion: true
        }, {
            _id: new ObjectId("642f932607fdf4a11a3fbafc"),
            name: 'VIP半年卡',
            days: 180,
            price: 16200,
            originalPrice: 18000,
            promotion: true
        }, {
            _id: new ObjectId("642f934307fdf4a11a3fbafe"),
            name: 'VIP年卡',
            days: 360,
            price: 28800,
            originalPrice: 36000,
            promotion: true
        }])
    await mongoClient.payment.db
        .collection('riceItems')
        .insertMany([{
            _id: new ObjectId("642f938a07fdf4a11a3fbb01"),
            name: '30天米粒',
            rice: 450,
            price: 4500,
            originalPrice: 4500,
            promotion: true
        }, {
            _id: new ObjectId("642f93a707fdf4a11a3fbb03"),
            name: '90天米粒',
            rice: 1350,
            price: 12800,
            originalPrice: 13500,
            promotion: true
        }, {
            _id: new ObjectId("642f93c907fdf4a11a3fbb05"),
            name: '180天米粒',
            rice: 2700,
            price: 24000,
            originalPrice: 27000,
            promotion: true
        }])
}
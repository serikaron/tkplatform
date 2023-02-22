'use strict'

/**
 * @swagger
 * /v1/member/items(会员直充):
 *   get:
 *     tags: ["payment(支付/商城)"]
 *     description: 会员直充
 *     responses:
 *       200:
 *         description: 返回列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                     example: VIP周卡
 *                   days:
 *                     type: number
 *                     example: 7
 *                   price:
 *                     type: number
 *                     example: 10
 *                   originalPrice:
 *                     type: number
 *                     example: 30
 *                   promotion:
 *                     type: boolean
 *
 */

/**
 * @swagger
 * /v1/rice/items(米粒购买):
 *   get:
 *     tags: ["payment(支付/商城)"]
 *     description: 米粒购买
 *     responses:
 *       200:
 *         description: 返回列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                     example: 30天米粒
 *                   rices:
 *                     type: number
 *                     example: 450
 *                   price:
 *                     type: number
 *                     example: 10
 *                   originalPrice:
 *                     type: number
 *                     example: 30
 *                   promotion:
 *                     type: boolean
 *
 */

/**
 * @swagger
 * /v1/wallet(用户钱包):
 *   get:
 *     tags: ["payment(支付/商城)"]
 *     description: 用户钱包
 *     responses:
 *       200:
 *         description: 返回列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rices:
 *                  type: number
 *
 */
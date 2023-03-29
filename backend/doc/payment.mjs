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

/**
 * @swagger
 * /v1/wallet/detail(资金明细):
 *   get:
 *     tags: ["payment(支付/商城)","个人中心"]
 *     parameters:
 *     - in: path
 *       name: offset
 *       schema:
 *         type: number
 *     - in: path
 *       name: limit
 *       schema:
 *         type: number
 *     - in: path
 *       name: type
 *       schema:
 *         type: number
 *         example: 0-全部，1-购买，2-提现，3-下级抽成，4-活动奖励，5-米粒消耗
 *     responses:
 *       200:
 *         description: 返回列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                  type: number
 *                 items:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                      member:
 *                        type: object
 *                        properties:
 *                          itemName:
 *                            type: string
 *                            example: vip月卡
 *                          price:
 *                            type: number
 *                          createdAt:
 *                            type: number
 *                          remainDays:
 *                            type: number
 *
 */

/**
 * @swagger
 * /v1/wallet/overview(资金总览):
 *   get:
 *     tags: ["payment(支付/商城)","个人中心"]
 *     responses:
 *       200:
 *         description: 返回列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 income:
 *                   type: number
 *                 withdraw:
 *                   type: number
 *                 recharge:
 *                   type: number
 *
 */

/**
 * @swagger
 * /v1/wallet/withdraw/records(提现管理):
 *   get:
 *     tags: ["payment(支付/商城)","个人中心"]
 *     parameters:
 *     - in: path
 *       name: offset
 *       schema:
 *         type: number
 *     - in: path
 *       name: limit
 *       schema:
 *         type: number
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: number
 *                     amount:
 *                       type: number
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       createdAt:
 *                         type: number
 *                       amount:
 *                         type: number
 *                       fee:
 *                         type: number
 *                       comment:
 *                         type: string
 *                       status:
 *                         type: number
 *
 *
 */
'use strict'

/**
 * @swagger
 * /v1/site/balance(站点余额):
 *   get:
 *     tags: [balance(站点余额)]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   site:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       icon:
 *                         type: string
 *                       account:
 *                         type: string
 *                   balance:
 *                     type: number
 */

/**
 * @swagger
 * /v1/site/withdraw/records(提现记录):
 *   get:
 *     tags: [balance(站点余额)]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                       name:
 *                         type: string
 *                       account:
 *                         type: string
 *                       withdrewAt:
 *                         type: number
 *                       amount:
 *                         type: number
 */
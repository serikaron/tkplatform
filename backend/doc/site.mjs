'use strict'

/**
 * @swagger
 * /backend/v1/sites(查询站点):
 *   get:
 *     tags: ["site(站点)"]
 *     description: 查询站点
 *     parameters:
 *     - in: path
 *       name: offset
 *       schema:
 *         type: Number
 *     - in: path
 *       name: limit
 *       schema:
 *         type: Number
 *     - in: path
 *       name: keyword
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: 返回列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                         example: 站点1
 *                       icon:
 *                         type: string
 *                         example: /static/sites/001.png
 *                       status:
 *                         type: number
 *                         example: 1-运营中
 *                       rates:
 *                         type: object
 *                         properties:
 *                           hot:
 *                             type: Number
 *                             example: 4.4
 *                           quality:
 *                             type: Number
 *                             example: 4.4
 *                       isFree:
 *                         type: boolean
 *                       added:
 *                         type: boolean
 *
 */

/**
 * @swagger
 * /backend/v1/site(添加站点):
 *   post:
 *     tags: ["site(站点)"]
 *     requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                         example: 站点1
 *                       icon:
 *                         type: string
 *                         example: /static/sites/001.png
 *                       status:
 *                         type: number
 *                         example: 1-运营中
 *                       rates:
 *                         type: object
 *                         properties:
 *                           hot:
 *                             type: Number
 *                             example: 4.4
 *                           quality:
 *                             type: Number
 *                             example: 4.4
 *                       isFree:
 *                         type: boolean
 *                       added:
 *                         type: boolean
 *
 */
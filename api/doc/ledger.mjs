'use strict'

/**
 * @swagger
 * /v1/stores(系统商城):
 *   get:
 *     tags: ["ledger(记帐帐本)"]
 *     description: 系统商城列表
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
 *                   name:
 *                     type: string
 *                     example: 陶宝
 *                   icon:
 *                     type: string
 *                     example: /static/stores/taobao.png
 */

/**
 * @swagger
 * /v1/ledger/accounts(系统商城买号):
 *   get:
 *     tags: ["ledger(记帐帐本)"]
 *     description: 系统买号列表
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
 *                   name:
 *                     type: string
 *                     example: 陶宝
 *                   icon:
 *                     type: string
 *                     example: /static/accounts/taobao.png
 *
 */

/**
 * @swagger
 * /v1/user/ledger/accounts(查询用户买号):
 *   get:
 *     tags: ["ledger(记帐帐本)"]
 *     description: 用户买号列表
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
 *                   name:
 *                     type: string
 *                     example: 陶宝
 *                   icon:
 *                     type: string
 *                     example: /static/accounts/taobao.png
 *                   account:
 *                     type: string
 *                     example: 用户输入的名字
 *
 */

/**
 * @swagger
 * /v1/user/ledger/account(添加用户买号):
 *   post:
 *     tags: ["ledger(记帐帐本)"]
 *     description: 添加用户买号
 *     requestBody:
 *       content:
 *         application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  name:
 *                    type: string
 *                    example: 陶宝
 *                  icon:
 *                    type: string
 *                    example: /static/accounts/taobao.png
 *                  account:
 *                    type: string
 *                    example: 用户输入的名字
 *     responses:
 *       200:
 *         description: 返回买号id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  accountId:
 *                    type: string
 *                    example: 买号id
 *
 */

/**
 * @swagger
 * /v1/user/ledger/account/:accountId(更新用户买号):
 *   put:
 *     tags: ["ledger(记帐帐本)"]
 *     description: 添加用户买号
 *     requestBody:
 *       content:
 *         application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  name:
 *                    type: string
 *                    example: 陶宝
 *                  icon:
 *                    type: string
 *                    example: /static/accounts/taobao.png
 *                  account:
 *                    type: string
 *                    example: 用户输入的名字
 *     responses:
 *       200:
 *         description: 返回成功
 *
 */

/**
 * @swagger
 * /v1/journal/accounts(系统收款号):
 *   get:
 *     tags: ["ledger(记帐帐本)"]
 *     description: 系统收款号列表
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
 *                   name:
 *                     type: string
 *                     example: 微信
 *                   icon:
 *                     type: string
 *                     example: /static/accounts/wechat.png
 *
 */

/**
 * @swagger
 * /v1/user/journal/accounts(查询用户收款号):
 *   get:
 *     tags: ["ledger(记帐帐本)"]
 *     description: 用户收款号列表
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
 *                   name:
 *                     type: string
 *                     example: 微信
 *                   icon:
 *                     type: string
 *                     example: /static/accounts/wechat.png
 *                   account:
 *                     type: string
 *                     example: 用户输入的名字
 *
 */

/**
 * @swagger
 * /v1/user/ledger/account(添加用户收款号):
 *   post:
 *     tags: ["ledger(记帐帐本)"]
 *     description: 添加用户收款号
 *     requestBody:
 *       content:
 *         application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  name:
 *                    type: string
 *                    example: 微信
 *                  icon:
 *                    type: string
 *                    example: /static/accounts/wechat.png
 *                  account:
 *                    type: string
 *                    example: 用户输入的名字
 *     responses:
 *       200:
 *         description: 返回买号id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  accountId:
 *                    type: string
 *                    example: 买号id
 *
 */

/**
 * @swagger
 * /v1/user/ledger/account/:accountId(更新用户收款号):
 *   put:
 *     tags: ["ledger(记帐帐本)"]
 *     description: 添加用户收款号
 *     requestBody:
 *       content:
 *         application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  name:
 *                    type: string
 *                    example: 微信
 *                  icon:
 *                    type: string
 *                    example: /static/accounts/wechat.png
 *                  account:
 *                    type: string
 *                    example: 用户输入的名字
 *     responses:
 *       200:
 *         description: 返回成功
 *
 */

/**
 * @swagger
 * /v1/ledger/entries?minDate=&maxDate=(查询抢单/帐本记录):
 *   get:
 *     tags: ["ledger(记帐帐本)"]
 *     description: 查询抢单/帐本记录，keptAt非空为已记帐记录
 *     parameters:
 *     - in: path
 *       name: minDate
 *       schema:
 *         type: Number
 *         example: 1676951437
 *       required: true
 *     - in: path
 *       name: maxDate
 *       schema:
 *         type: Number
 *         example: 1676951437
 *       required: true
 *     - in: path
 *       name: offset
 *       schema:
 *         type: Number
 *         example: 10
 *     - in: path
 *       name: limit
 *       schema:
 *         type: Number
 *         example: 10
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
 *                   createdAt:
 *                     type: Number
 *                     example: 1676951437 (抢单时间)
 *                   keptAt:
 *                     type: Number
 *                     example: 1676951437 (记帐时间)
 *                   site:
 *                     type: object
 *                     properties:
 *                       name:
 *                          type: string
 *                          example: 站点1
 *                       icon:
 *                          type: string
 *                          example: 连接1
 *                   account:
 *                     type: string
 *                     example: 对应用户站点中的 credential.account
 *                   store:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: 陶宝
 *                       icon:
 *                         type: string
 *                         example: /static/stores/taobao.png
 *                   ledgerAccount:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: 陶宝
 *                       icon:
 *                         type: string
 *                         example: /static/accounts/taobao.png
 *                       account:
 *                         type: string
 *                         example: 用户输入的名字
 *                   shop:
 *                     type: string
 *                     example: 用户输入的店铺
 *                   orderId:
 *                     type: string
 *                     example: 用户输入的订单编号
 *                   commission:
 *                     type: object
 *                     properties:
 *                       amount:
 *                         type: Number
 *                         example: 5.5
 *                       refunded:
 *                         type: Boolean
 *                         example: false
 *                   principle:
 *                     type: object
 *                     properties:
 *                       amount:
 *                         type: Number
 *                         example: 85.0
 *                       refunded:
 *                         type: Boolean
 *                         example: false
 *                   status:
 *                     type: Boolean
 *                     example: false(正常/异常)
 *                   comment:
 *                     type: string
 *                     example: 备注
 */

/**
 * @swagger
 * /v1/ledger/entry(抢单成功调用):
 *   post:
 *     tags: ["ledger(记帐帐本)"]
 *     description: 添加帐本记录
 *     requestBody:
 *       content:
 *         application/json:
 *            schema:
 *              type: string
 *              example: 参考查询接口的返回结构
 *     responses:
 *       200:
 *         description: 返回entryId
 *
 */

/**
 * @swagger
 * /v1/ledger/entry/:entryId(更新帐本记录，用于记帐或修改帐本):
 *   put:
 *     tags: ["ledger(记帐帐本)"]
 *     description: 更新帐本记录，用于记帐或修改帐本
 *     requestBody:
 *       content:
 *         application/json:
 *            schema:
 *              type: string
 *              example: 参考查询接口的返回结构
 *     responses:
 *       200:
 *         description: 返回成功
 *
 */

/**
 * @swagger
 * /v1/journal/entries?minDate=&maxDate=(查询提现帐本记录):
 *   get:
 *     tags: ["ledger(记帐帐本)"]
 *     description: 查询提现帐本记录
 *     parameters:
 *     - in: path
 *       name: minDate
 *       schema:
 *         type: Number
 *         example: 1676951437
 *       required: true
 *     - in: path
 *       name: maxDate
 *       schema:
 *         type: Number
 *         example: 1676951437
 *       required: true
 *     - in: path
 *       name: offset
 *       schema:
 *         type: Number
 *         example: 10
 *     - in: path
 *       name: limit
 *       schema:
 *         type: Number
 *         example: 10
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
 *                   createdAt:
 *                     type: Number
 *                     example: 1676951437
 *                   site:
 *                     type: object
 *                     properties:
 *                       name:
 *                          type: string
 *                          example: 站点1
 *                       icon:
 *                          type: string
 *                          example: 连接1
 *                   account:
 *                     type: string
 *                     example: 对应用户站点中的 credential.account
 *                   amount:
 *                     type: Number
 *                     example: 100.0
 *                   fee:
 *                     type: Number
 *                     example: 10.0
 *                   journalAccount:
 *                     type: Object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: 微信
 *                       icon:
 *                         type: string
 *                         example: /static/accounts/wechat.png
 *                       userAccount:
 *                         type: string
 *                         example: 用户输入的帐号
 *                   order:
 *                     type: string
 *                     example: 单号
 *                   credited:
 *                     type: boolean
 *                     example: true
 *                   comment:
 *                     type: string
 *                     example: 备注
 */

/**
 * @swagger
 * /v1/journal/entry(添加提现帐本记录):
 *   post:
 *     tags: ["ledger(记帐帐本)"]
 *     description: 添加提现记录
 *     requestBody:
 *       content:
 *         application/json:
 *            schema:
 *              type: string
 *              example: 参考查询接口的返回结构
 *     responses:
 *       200:
 *         description: 返回entryId
 *
 */

/**
 * @swagger
 * /v1/journal/entry/:entryId(更新提现帐本记录):
 *   put:
 *     tags: ["ledger(记帐帐本)"]
 *     description: 更新提现帐本记录
 *     requestBody:
 *       content:
 *         application/json:
 *            schema:
 *              type: string
 *              example: 参考查询接口的返回结构
 *     responses:
 *       200:
 *         description: 返回成功
 *
 */
'use strict'

/**
 * @swagger
 * /v1/ledger/stores(系统商城-记帐帐本✅):
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
 * /v1/ledger/accounts(系统商城买号✅):
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
 * /v1/user/ledger/accounts(查询用户买号✅):
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
 *                   id:
 *                     type: string
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
 * /v1/user/ledger/account(添加用户买号✅):
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
 * /v1/user/ledger/account/:accountId(更新用户买号✅):
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
 * /v1/user/ledger/account/:accountId(删除用户买号✅):
 *   delete:
 *     tags: ["ledger(记帐帐本)"]
 */

/**
 * @swagger
 * /v1/journal/accounts(系统收款号✅):
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
 * /v1/user/journal/accounts(查询用户收款号✅):
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
 *                   id:
 *                     type: string
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
 * /v1/user/journal/account(添加用户收款号✅):
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
 * /v1/user/journal/account/:accountId(更新用户收款号✅):
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
 * /v1/user/journal/account/:accountId(删除用户收款号✅):
 *   delete:
 *     tags: ["ledger(记帐帐本)"]
 */

/**
 * @swagger
 * /v1/ledger/sites(自定义站点✅):
 *   get:
 *     tags: ["ledger(记帐帐本)"]
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
 *                   account:
 *                     type: string
 *
 */

/**
 * @swagger
 * /v1/ledger/site(添加自定义站点✅):
 *   post:
 *     tags: ["ledger(记帐帐本)"]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   account:
 *                     type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *
 */

/**
 * @swagger
 * /v1/ledger/site/:site(删除自定义站点✅):
 *   delete:
 *     tags: ["ledger(记帐帐本)"]
 *
 */

/**
 * @swagger
 * /v1/ledger/entries/:minDate/:maxDate(帐本记录✅):
 *   get:
 *     tags: ["ledger(记帐帐本)"]
 *     description: 帐本记录
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
 *       name: siteName
 *       schema:
 *         type: string
 *         example: 站点为名
 *     - in: path
 *       name: siteId
 *       schema:
 *         type: string
 *         example: 站点ID
 *     - in: path
 *       name: refundStatus
 *       schema:
 *         type: number
 *         example: 0-全部，1-已返，2-未返，3-本金未返，佣金未返
 *     - in: path
 *       name: refundFrom
 *       schema:
 *         type: number
 *         example: 0-全部，1-商家返，2-平台返
 *     - in: path
 *       name: storeId
 *       schema:
 *         type: string
 *     - in: path
 *       name: key
 *       schema:
 *         type: string
 *         example: 帐号/买号/商家/店铺/订单号
 *     - in: path
 *       name: minPrinciple
 *       schema:
 *         type: number
 *         example: 本金
 *     - in: path
 *       name: maxPrinciple
 *       schema:
 *         type: number
 *         example: 本金
 *     - in: path
 *       name: status
 *       schema:
 *         type: number
 *         example: 0-全部，1-正常，2-异常
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
 *                       template:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                       createdAt:
 *                         type: Number
 *                         example: 1676951437
 *                       site:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                              type: string
 *                              example: 站点1
 *                           icon:
 *                              type: string
 *                              example: 连接1
 *                       taskId:
 *                         type: string
 *                         example: 任务编号
 *                       account:
 *                         type: string
 *                         example: 站点帐号
 *                       store:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                             example: 陶宝
 *                           icon:
 *                             type: string
 *                             example: /static/stores/taobao.png
 *                       ledgerAccount:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: 陶宝
 *                           icon:
 *                             type: string
 *                             example: /static/accounts/taobao.png
 *                           account:
 *                             type: string
 *                             example: 用户输入的名字
 *                       shop:
 *                         type: string
 *                         example: 店铺
 *                       product:
 *                         type: string
 *                         example: 商品
 *                       orderId:
 *                         type: string
 *                         example: 用户输入的订单编号
 *                       commission:
 *                         type: object
 *                         properties:
 *                           amount:
 *                             type: Number
 *                             example: 5.5
 *                           refunded:
 *                             type: Boolean
 *                             example: false
 *                       principle:
 *                         type: object
 *                         properties:
 *                           amount:
 *                             type: Number
 *                             example: 85.0
 *                           refunded:
 *                             type: Boolean
 *                             example: false
 *                       journalAccount:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                             example: 微信
 *                           icon:
 *                             type: string
 *                             example: /static/accounts/wechat.png
 *                           userAccount:
 *                             type: string
 *                             example: 用户输入的帐号
 *                       refund:
 *                         type: object
 *                         properties:
 *                           from:
 *                             type: number
 *                             example: 0-商家返，1-平台返
 *                           type:
 *                             type: number
 *                             example: 0-立返，1-货返
 *                       received:
 *                         type: number
 *                         example: 是否收货 0-否，1-是
 *                       status:
 *                         type: number
 *                         example: 0-正常，1-异常
 *                       screenshot:
 *                         type: string
 *                         example: 上传后的url
 *                       comment:
 *                         type: string
 *                         example: 备注
 *                       import:
 *                         type: boolean
 */

/**
 * @swagger
 * /v1/ledger/entry/:entryId(帐本记录✅):
 *   get:
 *     tags: ["ledger(记帐帐本)"]
 *     description: 帐本记录
 *     responses:
 *       200:
 *         description: 返回列表
 *         content:
 *           application/json:
 *             schema:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       template:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                       createdAt:
 *                         type: Number
 *                         example: 1676951437
 *                       site:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                              type: string
 *                              example: 站点1
 *                           icon:
 *                              type: string
 *                              example: 连接1
 *                       taskId:
 *                         type: string
 *                         example: 任务编号
 *                       account:
 *                         type: string
 *                         example: 站点帐号
 *                       store:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                             example: 陶宝
 *                           icon:
 *                             type: string
 *                             example: /static/stores/taobao.png
 *                       ledgerAccount:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: 陶宝
 *                           icon:
 *                             type: string
 *                             example: /static/accounts/taobao.png
 *                           account:
 *                             type: string
 *                             example: 用户输入的名字
 *                       shop:
 *                         type: string
 *                         example: 店铺
 *                       product:
 *                         type: string
 *                         example: 商品
 *                       orderId:
 *                         type: string
 *                         example: 用户输入的订单编号
 *                       commission:
 *                         type: object
 *                         properties:
 *                           amount:
 *                             type: Number
 *                             example: 5.5
 *                           refunded:
 *                             type: Boolean
 *                             example: false
 *                       principle:
 *                         type: object
 *                         properties:
 *                           amount:
 *                             type: Number
 *                             example: 85.0
 *                           refunded:
 *                             type: Boolean
 *                             example: false
 *                       journalAccount:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                             example: 微信
 *                           icon:
 *                             type: string
 *                             example: /static/accounts/wechat.png
 *                           userAccount:
 *                             type: string
 *                             example: 用户输入的帐号
 *                       refund:
 *                         type: object
 *                         properties:
 *                           from:
 *                             type: number
 *                             example: 0-商家返，1-平台返
 *                           type:
 *                             type: number
 *                             example: 0-立返，1-货返
 *                       received:
 *                         type: number
 *                         example: 是否收货 0-否，1-是
 *                       status:
 *                         type: number
 *                         example: 0-正常，1-异常
 *                       screenshot:
 *                         type: string
 *                         example: 上传后的url
 *                       comment:
 *                         type: string
 *                         example: 备注
 *                       import:
 *                         type: boolean
 */

/**
 * @swagger
 * /v1/ledger/entry(添加记帐✅):
 *   post:
 *     tags: ["ledger(记帐帐本)"]
 *     description: 记帐
 *     requestBody:
 *       content:
 *         application/json:
 *            schema:
 *               type: object
 *               properties:
 *                       template:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                       createdAt:
 *                         type: Number
 *                         example: 1676951437 如果不传，由后台生成
 *                       site:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                              type: string
 *                              example: 站点1
 *                           icon:
 *                              type: string
 *                              example: 连接1
 *                       taskId:
 *                         type: string
 *                         example: 任务编号
 *                       account:
 *                         type: string
 *                         example: 站点帐号
 *                       store:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                             example: 陶宝
 *                           icon:
 *                             type: string
 *                             example: /static/stores/taobao.png
 *                       ledgerAccount:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: 陶宝
 *                           icon:
 *                             type: string
 *                             example: /static/accounts/taobao.png
 *                           account:
 *                             type: string
 *                             example: 用户输入的名字
 *                       shop:
 *                         type: string
 *                         example: 店铺
 *                       product:
 *                         type: string
 *                         example: 商品
 *                       orderId:
 *                         type: string
 *                         example: 用户输入的订单编号
 *                       commission:
 *                         type: object
 *                         properties:
 *                           amount:
 *                             type: Number
 *                             example: 5.5
 *                           refunded:
 *                             type: Boolean
 *                             example: false
 *                       principle:
 *                         type: object
 *                         properties:
 *                           amount:
 *                             type: Number
 *                             example: 85.0
 *                           refunded:
 *                             type: Boolean
 *                             example: false
 *                       journalAccount:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                             example: 微信
 *                           icon:
 *                             type: string
 *                             example: /static/accounts/wechat.png
 *                           userAccount:
 *                             type: string
 *                             example: 用户输入的帐号
 *                       refund:
 *                         type: object
 *                         properties:
 *                           from:
 *                             type: number
 *                             example: 0-商家返，1-平台返
 *                           type:
 *                             type: number
 *                             example: 0-立返，1-货返
 *                       received:
 *                         type: number
 *                         example: 是否收货 0-否，1-是
 *                       status:
 *                         type: number
 *                         example: 0-正常，1-异常
 *                       screenshot:
 *                         type: string
 *                         example: 上传后的url
 *                       comment:
 *                         type: string
 *                         example: 备注
 *                       import:
 *                         type: boolean
 *     responses:
 *       200:
 *         description: 返回entryId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 entryId:
 *                   type: string
 *
 */

/**
 * @swagger
 * /v1/ledger/entry/:entryId(更新帐本记录✅):
 *   put:
 *     tags: ["ledger(记帐帐本)"]
 *     description: 更新帐本记录
 *     requestBody:
 *       content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                       template:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                       site:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                              type: string
 *                              example: 站点1
 *                           icon:
 *                              type: string
 *                              example: 连接1
 *                       taskId:
 *                         type: string
 *                         example: 任务编号
 *                       account:
 *                         type: string
 *                         example: 站点帐号
 *                       store:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                             example: 陶宝
 *                           icon:
 *                             type: string
 *                             example: /static/stores/taobao.png
 *                       ledgerAccount:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: 陶宝
 *                           icon:
 *                             type: string
 *                             example: /static/accounts/taobao.png
 *                           account:
 *                             type: string
 *                             example: 用户输入的名字
 *                       shop:
 *                         type: string
 *                         example: 店铺
 *                       product:
 *                         type: string
 *                         example: 商品
 *                       orderId:
 *                         type: string
 *                         example: 用户输入的订单编号
 *                       commission:
 *                         type: object
 *                         properties:
 *                           amount:
 *                             type: Number
 *                             example: 5.5
 *                           refunded:
 *                             type: Boolean
 *                             example: false
 *                       principle:
 *                         type: object
 *                         properties:
 *                           amount:
 *                             type: Number
 *                             example: 85.0
 *                           refunded:
 *                             type: Boolean
 *                             example: false
 *                       journalAccount:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                             example: 微信
 *                           icon:
 *                             type: string
 *                             example: /static/accounts/wechat.png
 *                           userAccount:
 *                             type: string
 *                             example: 用户输入的帐号
 *                       refund:
 *                         type: object
 *                         properties:
 *                           from:
 *                             type: number
 *                             example: 0-商家返，1-平台返
 *                           type:
 *                             type: number
 *                             example: 0-立返，1-货返
 *                       received:
 *                         type: number
 *                         example: 是否收货 0-否，1-是
 *                       status:
 *                         type: number
 *                         example: 0-正常，1-异常
 *                       screenshot:
 *                         type: string
 *                         example: 上传后的url
 *                       comment:
 *                         type: string
 *                         example: 备注
 *     responses:
 *       200:
 *         description: 返回成功
 *
 */

/**
 * @swagger
 * /v1/ledger/templates(记帐模板✅):
 *   get:
 *     tags: ["ledger(记帐帐本)"]
 *     description: 记帐模板
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
 *                   account:
 *                     type: boolean
 *                   taskId:
 *                     type: boolean
 *                   store:
 *                     type: boolean
 *                   ledgerAccount:
 *                     type: boolean
 *                   shop:
 *                     type: boolean
 *                   product:
 *                     type: boolean
 *                   journalAccount:
 *                     type: boolean
 *                   refund:
 *                     type: object
 *                     properties:
 *                       from:
 *                         type: boolean
 *                       type:
 *                         type: boolean
 *                   received:
 *                     type: boolean
 *                   status:
 *                     type: boolean
 *                   screenshot:
 *                     type: boolean
 *                   comment:
 *                     type: boolean
 *
 *
 */

/**
 * @swagger
 * /v1/ledger/template/:templateId(更新记帐模板✅):
 *   put:
 *     tags: ["ledger(记帐帐本)"]
 *     description: 更新记帐模板
 *     requestBody:
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   account:
 *                     type: boolean
 *                   taskId:
 *                     type: boolean
 *                   store:
 *                     type: boolean
 *                   ledgerAccount:
 *                     type: boolean
 *                   shop:
 *                     type: boolean
 *                   product:
 *                     type: boolean
 *                   journalAccount:
 *                     type: boolean
 *                   refund:
 *                     type: object
 *                     properties:
 *                       from:
 *                         type: boolean
 *                       type:
 *                         type: boolean
 *                   received:
 *                     type: boolean
 *                   status:
 *                     type: boolean
 *                   screenshot:
 *                     type: boolean
 *                   comment:
 *                     type: boolean
 */

/**
 * @swagger
 * /v1/ledger/statistics/:minDate/:maxDate(帐本统计✅):
 *   get:
 *     tags: ["ledger(记帐帐本)"]
 *     description: 帐本统计
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exceptions:
 *                   type: number
 *                 notYetRefunded:
 *                   type: number
 *                 principle:
 *                   type: number
 *                 commission:
 *                   type: number
 *
 *
 */

/**
 * @swagger
 * /v1/ledger/entries/count(统计帐本数量✅):
 *   get:
 *     tags: ["ledger(记帐帐本)"]
 *     parameters:
 *     - in: path
 *       name: year
 *       schema:
 *         type: number
 *         example: year为必填参数
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   month:
 *                     type: number
 *                   count:
 *                     type: number
 *
 */

/**
 * @swagger
 * /v1/ledger/entries(删除帐本数据✅):
 *   delete:
 *     tags: ["ledger(记帐帐本)"]
 *     parameters:
 *     - in: path
 *       name: year
 *       schema:
 *         type: number
 *         example: year为必填参数
 *     - in: path
 *       name: month
 *       schema:
 *         type: array
 *     - in: path
 *       name: import
 *       schema:
 *         type: number
 *
 */

/**
 * @swagger
 * /v1/ledger/entry/:entryId(删除帐本记录✅):
 *   delete:
 *     tags: ["ledger(记帐帐本)"]
 */

/**
 * @swagger
 * /v1/ledger/entries/refunded(全部设置为已返✅):
 *   put:
 *     tags: ["ledger(记帐帐本)"]
 */

/**
 * @swagger
 * /v1/journal/entries/:minDate/:maxDate(查询提现帐本记录✅):
 *   get:
 *     tags: ["ledger(记帐帐本)"]
 *     description: 查询提现帐本记录
 *     parameters:
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
 *     - in: path
 *       name: siteName
 *       schema:
 *         type: string
 *         example: 站点为名
 *     - in: path
 *       name: siteId
 *       schema:
 *         type: string
 *         example: 站点ID
 *     - in: path
 *       name: credited
 *       schema:
 *         type: number
 *         example: 0-全部，1-已到帐，2-未到帐
 *     - in: path
 *       name: key
 *       schema:
 *         type: string
 *         example: 帐号/收款号/订单号
 *     - in: path
 *       name: minAmount
 *       schema:
 *         type: number
 *         example: 金额
 *     - in: path
 *       name: maxAmount
 *       schema:
 *         type: number
 *         example: 金额
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
 *                   createdAt:
 *                     type: Number
 *                     example: 1676951437
 *                   site:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
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
 * /v1/journal/entry/:entryId(查询提现帐本记录✅):
 *   get:
 *     tags: ["ledger(记帐帐本)"]
 *     description: 查询提现帐本记录
 *     responses:
 *       200:
 *         description: 返回列表
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
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
 * /v1/journal/entry(添加提现帐本记录✅):
 *   post:
 *     tags: ["ledger(记帐帐本)"]
 *     description: 添加提现记录
 *     requestBody:
 *       content:
 *         application/json:
 *            schema:
 *                 type: object
 *                 properties:
 *                   createdAt:
 *                     type: Number
 *                     example: 1676951437
 *                   site:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
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
 *     responses:
 *       200:
 *         description: 返回entryId
 *
 */

/**
 * @swagger
 * /v1/journal/entry/:entryId(更新提现帐本记录✅):
 *   put:
 *     tags: ["ledger(记帐帐本)"]
 *     description: 更新提现帐本记录
 *     requestBody:
 *       content:
 *         application/json:
 *            schema:
 *                 type: object
 *                 properties:
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
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
 *     responses:
 *       200:
 *         description: 返回成功
 *
 */

/**
 * @swagger
 * /v1/journal/statistics/:minDate/:maxDate(提现帐本统计✅):
 *   get:
 *     tags: ["ledger(记帐帐本)"]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notYetCredited:
 *                   type: number
 *                 credited:
 *                   type: number
 *                 principle:
 *                   type: number
 */

/**
 * @swagger
 * /v1/journal/entries/count(统计提现帐本数量✅):
 *   get:
 *     tags: ["ledger(记帐帐本)"]
 *     parameters:
 *     - in: path
 *       name: year
 *       schema:
 *         type: number
 *         example: year为必填参数
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   month:
 *                     type: number
 *                   count:
 *                     type: number
 *
 */

/**
 * @swagger
 * /v1/journal/entries(删除提现帐本数据✅):
 *   delete:
 *     tags: ["ledger(记帐帐本)"]
 *     parameters:
 *     - in: path
 *       name: year
 *       schema:
 *         type: number
 *         example: year为必填参数
 *     - in: path
 *       name: month
 *       schema:
 *         type: array
 *
 */

/**
 * @swagger
 * /v1/journal/entry/:entryId(删除提现帐本记录✅):
 *   delete:
 *     tags: ["ledger(记帐帐本)"]
 */

/**
 * @swagger
 * /v1/journal/entries/credited(全部设置为已到帐✅):
 *   put:
 *     tags: ["ledger(记帐帐本)"]
 */

/**
 * @swagger
 * /v1/ledger/analyse/detail/:minDate/:maxDate(记帐分析-明细✅):
 *   get:
 *     tags: ["ledger(记帐帐本)"]
 *     responses:
 *       200:
 *         description: 明细列表
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
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       account:
 *                         type: string
 *                   total:
 *                      type: number
 *                   principle:
 *                     type: number
 *                   commission:
 *                      type: number
 *                   withdrawingSum:
 *                     type: number
 *
 */

/**
 * @swagger
 * /v1/ledger/analyse/overview/:minDate/:maxDate(记帐分析-总览✅):
 *   get:
 *     tags: ["ledger(记帐帐本)"]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 overview:
 *                   type: object
 *                   properties:
 *                     commission:
 *                       type: number
 *                     principle:
 *                       type: number
 *                     notYetRefunded:
 *                       type: number
 *                     count:
 *                       type: number
 *                 exception:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: number
 *                     amount:
 *                       type: number
 *                     principle:
 *                       type: number
 *                     commission:
 *                       type: number
 *                 commission:
 *                   type: object
 *                   properties:
 *                     notYetCount:
 *                       type: number
 *                     notYetAmount:
 *                       type: number
 *                     refundedCount:
 *                       type: number
 *                     refundedAmount:
 *                       type: number
 *                 principle:
 *                   type: object
 *                   properties:
 *                     notYetCount:
 *                       type: number
 *                     notYetAmount:
 *                       type: number
 *                     refundedCount:
 *                       type: number
 *                     refundedAmount:
 *                       type: number
 *                 cardDetail:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: object
 *                       properties:
 *                           notYetCredited:
 *                             type: number
 *                           credited:
 *                             type: number
 *                           count:
 *                             type: number
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           journalAccount:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                                 example: 微信
 *                               icon:
 *                                 type: string
 *                                 example: /static/accounts/wechat.png
 *                               userAccount:
 *                                 type: string
 *                                 example: 用户输入的帐号
 *                           notYetCredited:
 *                             type: number
 *                           credited:
 *                             type: number
 *                           count:
 *                             type: number
 *
 *
 *
 *
 *
 */


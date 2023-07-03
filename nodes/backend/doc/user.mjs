'use strict'




/**
 * @swagger
 * /backend/v1/admin/register(管理员注册):
 *   post:
 *     tags: ["user(用户相关)"]
 *     description: 用户注册
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: 注册成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: "a jwt object"
 *                     refreshToken:
 *                       type: string
 *                       example: "96defd9f-1a54-4cb8-b501-9076d8709074"
 *
 */

/**
 * @swagger
 * /backend/v1/admin/login(管理员登录):
 *   post:
 *     tags: ["user(用户相关)"]
 *     description: 用户登录
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: 登录成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: "a jwt object"
 *                     refreshToken:
 *                       type: string
 *                       example: "96defd9f-1a54-4cb8-b501-9076d8709074"
 *
 */

/**
 * @swagger
 * /backend/v1/captcha/require(请求图形码✅):
 *   post:
 *     tags: ["captcha(图形码)"]
 *     description: 获取图形码
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     key:
 *                       type: string
 *                       example: 1234
 *                     image:
 *                       type: string
 *                       example: baas64 图片字节
 *
 */

/**
 * @swagger
 * /backend/v1/sms/send(发送手机验证码✅):
 *   post:
 *     tags: ["sms(短信服务)"]
 *     description: 发送验证码到手机
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "13333333333"
 *               captcha:
 *                  type: object
 *                  properties:
 *                    key:
 *                      type: string
 *                      example: "1234"
 *                    code:
 *                      type: string
 *                      example: "4iF9"
 *
 *     responses:
 *       200:
 *         description: 发送成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: "success"
 *
 */

/**
 * @swagger
 * /backend/v1/register/user(用户注册):
 *   post:
 *     tags: ["user(用户相关)"]
 *     description: 用户注册
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "13333333333"
 *               password:
 *                 type: string
 *                 example: "123456"
 *               inviter:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *               smsCode:
 *                 type: string
 *                 example: "1234"
 *
 *     responses:
 *       200:
 *         description: 注册成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: "a jwt object"
 *                     refreshToken:
 *                       type: string
 *                       example: "96defd9f-1a54-4cb8-b501-9076d8709074"
 *       409:
 *         description: 用户已存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: -100
 *                 msg:
 *                   type: string
 *                   example: "用户已存在"
 *
 *
 */

/**
 * @swagger
 * /backend/v1/users(查询用户):
 *   get:
 *     tags: ["user(用户相关)"]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                 offset:
 *                   type: number
 *                 limit:
 *                   type: number
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       member:
 *                         type: object
 *                         properties:
 *                           expiration:
 *                             type: number
 *                             example: 会员过期时间
 *                       registeredAt:
 *                         type: string
 *                         example: 注册时间
 *                       upLine:
 *                         type: string
 *                         example: 上线uid
 *                       downLines:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *
 */

/**
 * @swagger
 * /backend/v1/user/:userId(查询用户):
 *   get:
 *     tags: ["user(用户相关)"]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 member:
 *                   type: object
 *                   properties:
 *                     expiration:
 *                       type: number
 *                       example: 会员过期时间
 *                 registeredAt:
 *                   type: string
 *                   example: 注册时间
 *                 upLine:
 *                   type: string
 *                   example: 上线uid
 *                 downLines:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *
 *
 */

/**
 * @swagger
 * /backend/v1/user/:userId/wallet("余额信息"):
 *   get:
 *     tags: ["user(用户相关)"]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *                   type: object
 *                   properties:
 *                     cash:
 *                       type: number
 *                       example: 现金
 *                     rice:
 *                       type: number
 *                       example: 米粒
 *                     invitePoint:
 *                       type: number
 *                       example: 拉新值
 *
 *
 *
 */

/**
 * @swagger
 * /backend/v1/system/settings("配置查询"):
 *   get:
 *     tags: ['系统配置']
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   key:
 *                     type: string
 *                   value:
 *                     type: any
 *
 */

/**
 * @swagger
 * /backend/v1/system/setting("更新配置"):
 *   put:
 *     tags: ['系统配置']
 *     requestBody:
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   key:
 *                     type: string
 *                   value:
 *                     type: any
 *
 */

/**
 * @swagger
 * /backend/v1/user/message(发送用户消息):
 *   post:
 *     tags: ["user(用户相关)"]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               userId:
 *                 type: string
 *
 */

/**
 * @swagger
 * /backend/v1/user/messages(查询消息✅):
 *   get:
 *     tags: ["user(用户相关)","个人中心"]
 *     parameters:
 *     - in path:
 *       name: offset
 *       type: number
 *     - in path:
 *       name: limit
 *       type: number
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                 offset:
 *                   type: number
 *                 limit:
 *                   type: number
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       content:
 *                         type: string
 *                       createdAt:
 *                         type: number
 *                       read:
 *                         type: boolean
 *
 *
 */

/**
 * @swagger
 * /backend/v1/system/versions(版本列表):
 *   get:
 *     tags: ['系统配置']
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   version:
 *                     type: string
 *                   url:
 *                     type: string
 *                     example: 下载地址
 *                   size:
 *                     type: number
 *                     example: 字节大小
 *                   updateLog:
 *                     type: string
 *                     example: 版本公告
 *                   constraint:
 *                     type: boolean
 *                     example: 强制更新
 */

/**
 * @swagger
 * /backend/v1/system/version(添加版本):
 *   post:
 *     tags: ['系统配置']
 *     requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   version:
 *                     type: string
 *                   url:
 *                     type: string
 *                     example: 下载地址
 *                   size:
 *                     type: number
 *                     example: 字节大小
 *                   updateLog:
 *                     type: string
 *                     example: 版本公告
 *                   constraint:
 *                     type: boolean
 *                     example: 强制更新
 */

/**
 * @swagger
 * /backend/v1/system/version/:versionId(删除版本):
 *   post:
 *     tags: ['系统配置']
 */

/**
 * @swagger
 * /backend/v1/user/reports(用户反馈列表):
 *   get:
 *     tags: ["反馈建议管理"]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   type:
 *                     type: string
 *                   site:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                   detail:
 *                     type: string
 *                   screenshot:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: 上传后的地址
 *                   video:
 *                     type: string
 *                     example: 上传后的地址
 *                   reportedAt:
 *                     type: number
 *                     example: timestamp
 *                   handled:
 *                     type: boolean
 */

/**
 * @swagger
 * /backend/v1/user/report/:reportId(设置用户反馈):
 *   put:
 *     tags: ["反馈建议管理"]
 *
 */

/**
 * @swagger
 * /backend/v1/user/level/setting(用户等级设置):
 *   post:
 *     tags: ["user(用户相关)"]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               level:
 *                 type: number
 *               user_id:
 *                 type: string
 *
 */

/**
 * @swagger
 * /backend/v1/api/user/wallet/withdraw/audit(用户提现审核):
 *   post:
 *     tags: ["user(用户相关)"]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               record_id:
 *                 type: string
 *
 */

/**
 * @swagger
 * /backend/v1/admins/profile(查询后台管理员):
 *   get:
 *     tags: ["user(用户相关)"]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   username:
 *                     type: string
 *
 */

/**
 * @swagger
 * /backend/v1/admin/:adminId/profile(查询后台管理员):
 *   get:
 *     tags: ["user(用户相关)"]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   username:
 *                     type: string
 *
 */

/**
 * @swagger
 * /backend/v1/admins/privileges(查询后台管理员权限):
 *   get:
 *     tags: ["user(用户相关)"]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   adminId:
 *                     type: string
 *                   privileges:
 *                     type: array
 *                     items:
 *                       type: integer
 *                       example: 0-超级权限，1-用户权限，2-财务权限，3-站点权限，4-系统权限
 *
 */

/**
 * @swagger
 * /backend/v1/admin/:adminId/privileges(查询后台管理员权限):
 *   get:
 *     tags: ["user(用户相关)"]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   adminId:
 *                     type: string
 *                   privileges:
 *                     type: array
 *                     items:
 *                       type: integer
 *                       example: 0-超级权限，1-用户权限，2-财务权限，3-站点权限，4-系统权限
 */

/**
 * @swagger
 * /backend/v1/admin/:adminId/privileges(设置管理员权限):
 *   put:
 *     tags: ["user(用户相关)"]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *                     type: array
 *                     items:
 *                       type: integer
 *                       example: 0-超级权限，1-用户权限，2-财务权限，3-站点权限，4-系统权限
 *
 */

/**
 * @swagger
 * /backend/v2/user/member(添加会员):
 *   post:
 *     tags: ["user(用户相关)", "v2"]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               days:
 *                 type: number
 *
 */
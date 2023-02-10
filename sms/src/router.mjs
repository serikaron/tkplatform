'use strict'
import express from "express";

export const v1Router = express.Router()
export const smsRouter = express.Router()
v1Router.use('/sms', smsRouter)

'use strict'

import express from "express";
import 'express-async-errors'

export const v1router = express.Router()
export const userRouter = express.Router()
v1router.use('/user', userRouter)
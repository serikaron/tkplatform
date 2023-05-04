'use strict'

import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import {TKResponse} from "../common/TKResponse.mjs";
import {NeedAuth} from "../common/errors/00000-basic.mjs";
import {axiosCall} from "../common/call.mjs";

const app = express()

dotenv.config()

const verifyToken = async (token) => {
    if (token === "") {
        console.log("empty token")
        return TKResponse.fromError(new NeedAuth())
    } else {
        return await axiosCall({
            url: `/v1/token/${token}/verify`,
            baseURL: "http://token:8080",
            method: 'get'
        })
    }
}

const getId = async (req) => {
    const tokenRsp = await verifyToken(req.header("authentication"))
    console.log(tokenRsp.toString())
    if (tokenRsp.isError()) {
        throw new NeedAuth()
    }

    return tokenRsp.data.id
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        getId(req)
            .then(id => {
                const dir = `/res/${id}/`
                console.log(`dir: ${dir}`)
                req.dir = `${id}`
                fs.mkdir(dir, err => {
                    if (err && err.errno !== -17) {
                        throw err
                    }
                    cb(null, dir)
                })
            })
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + '-' + Math.round(Math.random() * 1E9)
        console.log(`filename: ${filename}`)
        req.filename = filename
        cb(null, filename)
    }
})
const upload = multer({storage: storage})

app.post('/v1/file',
    upload.single('image'),
    (req, res) => {
        console.log(req.file, req.body)
        const fullPath = `${process.env.HOST_NAME}/file/${req.dir}/${req.filename}`
        console.log(`fullPath: ${fullPath}`)
        res.json({url: fullPath})
    }
)

app.listen(8080, () => {
    console.log("ledger service started")
})
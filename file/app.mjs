'use strict'

import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";

const app = express()

dotenv.config()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = `/res/${req.headers.id}/`
        console.log(`dir: ${dir}`)
        req.dir = `${req.headers.id}`
        fs.mkdir(dir, err => {
            if (err && err.errno !== -17) {
                throw err
            }
            cb(null, dir)
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
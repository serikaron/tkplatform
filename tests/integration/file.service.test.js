'use restrict'

import axios from "axios";
import {ObjectId} from "mongodb";
import fs from "fs";
import FormData from "form-data";
import crypto from "crypto";

const upload = async (filepath, userId) => {
    const formData = new FormData()
    const file = await fs.createReadStream(filepath)
    formData.append('image', file, "test.png")
    const r = await axios.post(
        'http://localhost:9009/v1/file',
        formData,
        {
            headers: {
                ...formData.getHeaders(),
                id: userId,
            }
        })

    expect(r.status).toBe(200)
    expect(r.data.url.length).toBeGreaterThan(0)
    return r.data.url
}

test('upload', async () => {
    const userId = new ObjectId().toString()
    const filePath = "./res/test.png"
    const url = await upload(filePath, userId)
    const downloadResponse = await axios(url, {responseType: "stream"})
    expect(downloadResponse.status).toBe(200)

    const originalHash = await calculateMD5(filePath);
    const downloadedHash = await calculateMD5(downloadResponse.data);

    const url1 = await upload(filePath, userId)

    expect(downloadedHash).toEqual(originalHash);
})

async function calculateMD5(file) {
    const hash = crypto.createHash('md5');
    const stream = typeof file === 'string' ? fs.createReadStream(file) : file;

    return new Promise((resolve, reject) => {
        stream.on('data', chunk => hash.update(chunk));
        stream.on('end', () => resolve(hash.digest('hex')));
        stream.on('error', error => reject(error));
    });
}
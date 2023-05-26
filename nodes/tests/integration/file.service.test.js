'use restrict'

import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import crypto from "crypto";

// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MjJhZTVkNTZlZjBkOTZmZjM0MmVmNCIsInBob25lIjoiMTMzMzMzMzMzMzMiLCJpYXQiOjE2ODA4NTQ4NjIsImV4cCI6MTY4MDg1NTc2Mn0.EEBLcj3E3HFjjQEhL8SKSPFW_VIYgbJKidcf93BEf2w'
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZjVlNWNmMWZjNGMwM2FmZmM5M2ZhMiIsInBob25lIjoiMTg5Mzg5MDE0ODciLCJpYXQiOjE2ODEwOTQ4MDYsImV4cCI6MTY4MTA5NTcwNn0.8Lg5lwQl4ArFEp-Hk4Jvy2m_OUmmbuziKlXWgvbK97U'

const upload = async (filepath) => {
    const formData = new FormData()
    const file = await fs.createReadStream(filepath)
    formData.append('image', file, "test.png")
    const r = await axios.post(
        'http://car.daoyi365.com:9000/v1/file',
        formData,
        {
            headers: {
                ...formData.getHeaders(),
                authentication: token,
            }
        })

    expect(r.status).toBe(200)
    expect(r.data.url.length).toBeGreaterThan(0)
    return r.data.url
}

test.skip('upload', async () => {
    const filePath = "./res/test.png"
    const url = await upload(filePath)
    const downloadResponse = await axios(url, {responseType: "stream"})
    expect(downloadResponse.status).toBe(200)

    const originalHash = await calculateMD5(filePath);
    const downloadedHash = await calculateMD5(downloadResponse.data);

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
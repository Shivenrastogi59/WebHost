import dotenv from 'dotenv';
dotenv.config();
import  express from 'express';
import cors from 'cors';
import simpleGit from 'simple-git';
import path from 'path';
import { uploadFile } from './aws';
import { createClient } from 'redis';

const publisher = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.HOST,
        port: 15577 
    }
});
publisher.on('error', err => console.log('Redis Client Error', err));
(async () => {
    await publisher.connect();
})();

const subscriber = createClient();
subscriber.connect();

import { generate } from './utils';
import { getAllFiles } from './file';

const app = express();
app.use(cors());
app.use(express.json());
console.log(__dirname);

app.post("/deploy", async (req, res) =>{
    const repoUrl = req.body.repoUrl; //eg:github.com/username/repo
    const id = generate();
    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

    const files = getAllFiles(path.join(__dirname, `output/${id}`));
    
    // files.forEach(async (file) => {
    //     await uploadFile(file.slice(__dirname.length + 1), file);
    // });

    const baseFolder = path.join(__dirname, `output/${id}`);
    files.forEach(async (relativeFilePath) => {
        const fullPath = path.join(baseFolder, relativeFilePath); // local file path
        const s3Key = path.join(`output/${id}`, relativeFilePath).split(path.sep).join('/'); // for S3 key
        await uploadFile(s3Key, fullPath);
    });

    publisher.lPush("build-queue", id);
    publisher.hSet("status", id, "uploaded");

    console.log(`Deployment started for ${id} with repo ${repoUrl}`);

    res.json({
        id: id
    });
})

app.get("/status", async (req, res) => {
    const id = req.query.id;
    const response = await subscriber.hGet("status", id as string);
    res.json({
        status: response
    })
})

app.listen(3000);
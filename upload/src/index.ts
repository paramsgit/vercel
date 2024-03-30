import express from "express"
import cors from "cors";
import simpleGit from "simple-git";
const { v4: uuidv4 } = require('uuid');
import path from "path"
import { getAllFiles } from "./files";
import { uploadFile } from "./aws";
import { createClient } from "redis";
require("dotenv").config();

const publisher= createClient({
    password: process.env.redisPassword,
    socket: {
        host: process.env.redisHost,
        port: parseInt(process.env.redisPort||"")
    }
});
publisher.connect();
const subscriber=createClient({
    password: process.env.redisPassword,
    socket: {
        host: process.env.redisHost,
        port: parseInt(process.env.redisPort||"")
    }
});
subscriber.connect();

const app=express()
app.use(cors())
app.use(express.json())

app.post("/deploy",async (req,res)=>{
const repoUrl=req.body.repoUrl;
const uuid = uuidv4();
const id = uuid.replace(/-/g, '').substring(0, 8);
console.log(id)
await simpleGit().clone(repoUrl,path.join(__dirname,`output/${id}`))
const filesArray=getAllFiles(path.join(__dirname,`output/${id}`))
console.log(filesArray)

const uploadPromises= filesArray.map(async file=>{
    await uploadFile(file.slice(__dirname.length+1),file);
})

await Promise.all(uploadPromises);

publisher.lPush("build-queue",id);
publisher.hSet("status",id,"uploaded");

res.json({ id})
})

app.get("/status",async (req,res)=>{
    const id=req.query.id;
    const response= await subscriber.hGet("status",id as string);

    res.json({
        status:response
    })
})

app.listen(5000)



require("dotenv").config();
const accessKey=( process.env.accessKey||"")
const secretKey=( process.env.secretKey||"")
const bucketName=( process.env.bucketName||"")


import express from "express";
import {S3} from "aws-sdk"
const cookieParser = require("cookie-parser");
import url from 'url'
const s3=new S3({
    accessKeyId:accessKey,
    secretAccessKey:secretKey
})

const app=express();
app.use(cookieParser());

app.get("/*",async (req,res)=>{
    const fullUrl=req.protocol + '://' + req.get('host') + req.originalUrl
    const parsedUrl = new URL(fullUrl);
    let id = parsedUrl.searchParams.get('id');
    const filePath = parsedUrl.pathname;
    

let idFromCookie=req.cookies['fileId']
if(id==null && idFromCookie)
id=idFromCookie

console.log(id,filePath)
let contents;
try {
     contents=await s3.getObject({
        Bucket:bucketName,
        Key:`dist/${id}${filePath}`
    }).promise(); 
} catch (error) {
    console.log(error)
}


const type=filePath.endsWith("html")?"text/html":filePath.endsWith("css")?"text/css":"application/javascript"
res.set("Content-Type",type);

res.cookie("fileId", id);
// res.send("Hello")
res.send(contents && contents.Body)
})

app.listen(5010)
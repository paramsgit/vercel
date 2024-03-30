require("dotenv").config();
const accessKey=( process.env.accessKey||"")
const secretKey=( process.env.secretKey||"")
const bucketName=( process.env.bucketName||"")

import { S3 } from "aws-sdk"
import fs from 'fs'

const s3= new S3({
    accessKeyId:accessKey,
    secretAccessKey:secretKey,
})

export const uploadFile=async (fileName:string,localFilePath:string)=>{
const file=fs.readFileSync(localFilePath);
const response=await s3.upload({
    Body:file,
    Bucket:bucketName,
    Key:fileName
}).promise();
console.log(response)
}

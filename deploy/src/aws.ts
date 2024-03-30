require("dotenv").config();
const accessKey=( process.env.accessKey||"")
const secretKey=( process.env.secretKey||"")
const bucketName=( process.env.bucketName||"")

import { S3 } from "aws-sdk"
import path from "path"
import {dir} from "console";
import fs from "fs";


const s3=new S3({
    accessKeyId:accessKey,
    secretAccessKey:secretKey
})

export const downloadS3Folder=async(folderId:string)=>{
console.log(folderId)
const allFiles=await s3.listObjectsV2({
    Bucket:bucketName,
    Prefix:folderId
}).promise();

const allPromises=allFiles.Contents?.map(async ({Key})=>{
return new Promise(async (resolve)=>{
    if(!Key){
        resolve("");
        return;
    }
    const finalOutputPath= path.join(__dirname,Key);
    const outputFile=fs.createWriteStream(finalOutputPath);
    const dirName=path.dirname(finalOutputPath);

    if(!fs.existsSync(dirName)){
        fs.mkdirSync(dirName,{recursive:true});
    }
    s3.getObject({
        Bucket:bucketName,
        Key
    }).createReadStream().pipe(outputFile)
    .on("finish",()=>{
        console.log("downloaded")
        resolve("")
    })
})
}) || []

await Promise.all(allPromises?.filter(x=>x!== undefined))

}

const getAllFiles=(folderPath:string)=>{
    let response:string[]=[];
    
    const allFilesAndFolders=fs.readdirSync(folderPath);
    allFilesAndFolders.forEach(file=>{
        const fullFilePath=path.join(folderPath,file);
        if(fs.statSync(fullFilePath).isDirectory()){
            response=response.concat(getAllFiles(fullFilePath))
        }else{
            response.push(fullFilePath)
        }
    });
    return response;
    }

    const uploadFile=async (fileName:string,localFilePath:string)=>{
        const file=fs.readFileSync(localFilePath);
        const response=await s3.upload({
            Body:file,
            Bucket:bucketName,
            Key:fileName
        }).promise();
        console.log(response)
        }
        
export function copyFinalDist(id:string){
const folderPath=path.join(__dirname,`output/${id}/dist`);
const allFiles=getAllFiles(folderPath);
allFiles.forEach(file=>{
    uploadFile(`dist/${id}/`+file.slice(folderPath.length+1),file)
})
}
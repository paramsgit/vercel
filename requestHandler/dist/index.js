"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const accessKey = (process.env.accessKey || "");
const secretKey = (process.env.secretKey || "");
const bucketName = (process.env.bucketName || "");
const express_1 = __importDefault(require("express"));
const aws_sdk_1 = require("aws-sdk");
const cookieParser = require("cookie-parser");
const s3 = new aws_sdk_1.S3({
    accessKeyId: accessKey,
    secretAccessKey: secretKey
});
const app = (0, express_1.default)();
app.use(cookieParser());
app.get("/*", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    const parsedUrl = new URL(fullUrl);
    let id = parsedUrl.searchParams.get('id');
    const filePath = parsedUrl.pathname;
    let idFromCookie = req.cookies['fileId'];
    if (id == null && idFromCookie)
        id = idFromCookie;
    console.log(id, filePath);
    let contents;
    try {
        contents = yield s3.getObject({
            Bucket: bucketName,
            Key: `dist/${id}${filePath}`
        }).promise();
    }
    catch (error) {
        console.log(error);
    }
    const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript";
    res.set("Content-Type", type);
    res.cookie("fileId", id);
    // res.send("Hello")
    res.send(contents && contents.Body);
}));
app.listen(5010);

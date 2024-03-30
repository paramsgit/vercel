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
exports.copyFinalDist = exports.downloadS3Folder = void 0;
require("dotenv").config();
const accessKey = (process.env.accessKey || "");
const secretKey = (process.env.secretKey || "");
const bucketName = (process.env.bucketName || "");
const aws_sdk_1 = require("aws-sdk");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const s3 = new aws_sdk_1.S3({
    accessKeyId: accessKey,
    secretAccessKey: secretKey
});
const downloadS3Folder = (folderId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log(folderId);
    const allFiles = yield s3.listObjectsV2({
        Bucket: bucketName,
        Prefix: folderId
    }).promise();
    const allPromises = ((_a = allFiles.Contents) === null || _a === void 0 ? void 0 : _a.map(({ Key }) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            if (!Key) {
                resolve("");
                return;
            }
            const finalOutputPath = path_1.default.join(__dirname, Key);
            const outputFile = fs_1.default.createWriteStream(finalOutputPath);
            const dirName = path_1.default.dirname(finalOutputPath);
            if (!fs_1.default.existsSync(dirName)) {
                fs_1.default.mkdirSync(dirName, { recursive: true });
            }
            s3.getObject({
                Bucket: bucketName,
                Key
            }).createReadStream().pipe(outputFile)
                .on("finish", () => {
                console.log("downloaded");
                resolve("");
            });
        }));
    }))) || [];
    yield Promise.all(allPromises === null || allPromises === void 0 ? void 0 : allPromises.filter(x => x !== undefined));
});
exports.downloadS3Folder = downloadS3Folder;
const getAllFiles = (folderPath) => {
    let response = [];
    const allFilesAndFolders = fs_1.default.readdirSync(folderPath);
    allFilesAndFolders.forEach(file => {
        const fullFilePath = path_1.default.join(folderPath, file);
        if (fs_1.default.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath));
        }
        else {
            response.push(fullFilePath);
        }
    });
    return response;
};
const uploadFile = (fileName, localFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    const file = fs_1.default.readFileSync(localFilePath);
    const response = yield s3.upload({
        Body: file,
        Bucket: bucketName,
        Key: fileName
    }).promise();
    console.log(response);
});
function copyFinalDist(id) {
    const folderPath = path_1.default.join(__dirname, `output/${id}/dist`);
    const allFiles = getAllFiles(folderPath);
    allFiles.forEach(file => {
        uploadFile(`dist/${id}/` + file.slice(folderPath.length + 1), file);
    });
}
exports.copyFinalDist = copyFinalDist;

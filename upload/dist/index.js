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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const simple_git_1 = __importDefault(require("simple-git"));
const { v4: uuidv4 } = require('uuid');
const path_1 = __importDefault(require("path"));
const files_1 = require("./files");
const aws_1 = require("./aws");
const redis_1 = require("redis");
require("dotenv").config();
const publisher = (0, redis_1.createClient)({
    password: process.env.redisPassword,
    socket: {
        host: process.env.redisHost,
        port: parseInt(process.env.redisPort || "")
    }
});
publisher.connect();
const subscriber = (0, redis_1.createClient)({
    password: process.env.redisPassword,
    socket: {
        host: process.env.redisHost,
        port: parseInt(process.env.redisPort || "")
    }
});
subscriber.connect();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/deploy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const repoUrl = req.body.repoUrl;
    const uuid = uuidv4();
    const id = uuid.replace(/-/g, '').substring(0, 8);
    console.log(id);
    yield (0, simple_git_1.default)().clone(repoUrl, path_1.default.join(__dirname, `output/${id}`));
    const filesArray = (0, files_1.getAllFiles)(path_1.default.join(__dirname, `output/${id}`));
    console.log(filesArray);
    const uploadPromises = filesArray.map((file) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, aws_1.uploadFile)(file.slice(__dirname.length + 1), file);
    }));
    yield Promise.all(uploadPromises);
    publisher.lPush("build-queue", id);
    publisher.hSet("status", id, "uploaded");
    res.json({ id });
}));
app.get("/status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    const response = yield subscriber.hGet("status", id);
    res.json({
        status: response
    });
}));
app.listen(5000);

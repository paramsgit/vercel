import { createClient,commandOptions } from "redis";
import { copyFinalDist, downloadS3Folder } from "./aws";
import { buildProject } from "./utils";
require("dotenv").config();

const subscriber=createClient({
    password: process.env.redisPassword,
    socket: {
        host: process.env.redisHost,
        port: parseInt(process.env.redisPort||"")
    }
});
subscriber.connect();
const publisher=createClient({
    password: process.env.redisPassword,
    socket: {
        host: process.env.redisHost,
        port: parseInt(process.env.redisPort||"")
    }
});
publisher.connect();

async function main() {
    console.log("main function running")
    while(1){
        const response=await subscriber.brPop(
            commandOptions({isolated:true}),
            'build-queue',
            0
        );
        console.log(response)
        // @ts-ignore
        const id=response.element

        await downloadS3Folder(`output/${id}`);
        await buildProject(id);
        copyFinalDist(id)
        publisher.hSet("status",id,"deployed")
    }
}

main()

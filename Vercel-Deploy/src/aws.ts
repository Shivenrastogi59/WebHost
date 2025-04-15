import { S3 } from "aws-sdk";
import { dir } from "console";
import fs from "fs";
import path from "path";

const s3 = new S3({
    accessKeyId: process.env.ID,
    secretAccessKey: process.env.SECRET,
    endpoint: process.env.ENDPOINT
});

export async function downloadS3File(prefix: string){
    console.log(prefix);
    const allFiles = await s3.listObjectsV2({
        Bucket: "web-host",
        Prefix: prefix
    }).promise();

    const allPromises = allFiles.Contents?.map(async ({Key}) => {
        return new Promise(async (resolve) =>{
            if(!Key) {
                resolve("");
                return;
            }
            const finalOutputPath = path.join(__dirname, Key);  // dist/output/id
            const outputFile = fs.createWriteStream(finalOutputPath);
            const dirName = path.dirname(finalOutputPath);
            if (!fs.existsSync(dirName)) {
                fs.mkdirSync(dirName, { recursive: true });
            }
            s3.getObject({
                Bucket: "web-host",
                Key
            }).createReadStream().pipe(outputFile).on("finish", () =>{
                resolve("");
            }) 
        })
    }) || []

    await Promise.all(allPromises?.filter(x => x !== undefined));
}
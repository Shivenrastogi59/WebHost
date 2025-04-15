// import dotenv from 'dotenv';
// dotenv.config();
// import { S3 } from 'aws-sdk';
// import fs from 'fs';

// const s3 = new S3({
//     accessKeyId: process.env.ID,
//     secretAccessKey: process.env.SECRET,
//     endpoint: process.env.ENDPOINT
// })

// export const uploadFile = async (fileName: string, localFilePath: string) =>{
//     console.log("Uploading file to S3...");
//     const fileContent = fs.readFileSync(localFilePath);
//     const response = await s3.upload({
//         Body: fileContent,
//         Bucket: "web-host",
//         Key: fileName,
//     }).promise();
//     console.log("File uploaded successfully", response.Location);
// }

import dotenv from 'dotenv';
dotenv.config();
import { S3 } from 'aws-sdk';
import fs from 'fs';
import mime from 'mime-types'; // ✅ to set correct content-type

const s3 = new S3({
    accessKeyId: process.env.ID,
    secretAccessKey: process.env.SECRET,
    endpoint: process.env.ENDPOINT,
    s3ForcePathStyle: true // important for some S3-compatible storage like Cloudflare R2
});

export const uploadFile = async (s3Key: string, localFilePath: string) => {
    console.log(`Uploading ${s3Key} to S3...`);

    // Ensure file exists before reading
    if (!fs.existsSync(localFilePath)) {
        console.error(`File not found: ${localFilePath}`);
        return;
    }

    const fileContent = fs.readFileSync(localFilePath);
    const contentType = mime.lookup(localFilePath) || 'application/octet-stream';

    const response = await s3.upload({
        Body: fileContent,
        Bucket: "web-host",
        Key: s3Key, // Keep the folder structure in S3
        ContentType: contentType
    }).promise();

    console.log("✅ File uploaded successfully:", response.Location);
};

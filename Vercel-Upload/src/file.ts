// import fs from 'fs';
// import path from 'path';

// export const getAllFiles = (folderPath: string) => {
//     let response: string[] = [];

//     const allFilesAndFolders = fs.readdirSync(folderPath);
//     allFilesAndFolders.forEach(file =>{
//         const fullFilePath = path.join(folderPath, file);
//         if(fs.statSync(fullFilePath).isDirectory()){
//             response = response.concat(getAllFiles(fullFilePath));
//         }else{
//             response.push(fullFilePath);
//         }
//     });
//     return response;
// }

import fs from 'fs';
import path from 'path';

export const getAllFiles = (folderPath: string, rootPath: string = folderPath): string[] => {
    let response: string[] = [];

    const allFilesAndFolders = fs.readdirSync(folderPath);
    allFilesAndFolders.forEach(file => {
        if (file.startsWith('.') || file === 'node_modules') return;

        const fullPath = path.join(folderPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            response = response.concat(getAllFiles(fullPath, rootPath));
        } else {
            // Get the relative path and replace backslashes with forward slashes
            const relativePath = path.relative(rootPath, fullPath).split(path.sep).join('/');
            response.push(relativePath);
        }
    });

    return response;
};

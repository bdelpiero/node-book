import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//TODO entry point that checks if first dir is a valid dir. if so, calls process with files.length
function listNestedFiles(dir, cb) {
    let total = 0;
    let processed = 0;
    const totalFiles = [];

    fs.readdir(dir, (err, files) => {
        if (err) {
            return cb(err)
        }
        total = files.length;
        files.forEach((file) => {
        
            if (isDir(path.resolve(dir, file))) {
                listNestedFiles(path.resolve(dir, file), (err, files) => {
                    if (err) {
                        return cb(err)
                    }
                    // se supone que aca van a llegar solo los files? o pueden ser algunos dirs?
                    files.forEach((file) => {
                        totalFiles.push(file)
                    })
                    if(++processed === total) {
                        return cb(null, totalFiles)
                    }
                })
            } else {
                totalFiles.push(file)
                if(++processed === total) {
                    return cb(null, files)
                }
            }
        })
    })

}

function isDir(path) {
    return fs.lstatSync(path).isDirectory() 
}

const dir = path.resolve(__dirname, 'test')
listNestedFiles(dir, (err, files) => {
    if (err) {
       return console.error(err);
    }
    console.log(`NestedFiles: ${files}`)
})
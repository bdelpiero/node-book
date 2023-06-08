import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//TODO entry point that checks if first dir is a valid dir. if so, calls process with files.length
function listNestedFiles(dir, cb) {
    const files = [];
    let processed = 0;
    let total = 0;

    function process(currPath, entryPoint) {
        fs.stat(currPath, (error, stats) => {
            if (error) {
                return cb(error);
            }
    
            if (!stats.isDirectory() && entryPoint) {
                return cb(new Error(`Not a dir`))
            }
            
            if (stats.isFile()) {
                files.push(currPath)
            }
            
            if (++processed == total) {
                return files;
            }
    
            fs.readdir(currPath, (err, files) => {
                if (err) {
                    return cb(err)
                }
                total += files.length;
                files.forEach((file) => process(path.resolve(currPath, file), false ))
            })
        })

    }

    process(dir, true)

}

const dir = path.resolve(__dirname, 'test')
listNestedFiles(dir, (err, files) => {
    if (err) {
       return console.error(err);
    }
    console.log(`NestedFiles: ${files}`)
})
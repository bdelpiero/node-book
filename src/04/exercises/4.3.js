import fs from "fs"
import path from "path"

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const containingFiles = [];
let processing = 0

export function recursiveFind(dir, word, cb) {
    // processing++
    fs.readdir(dir, (err, files) => {
        if(err) {
            return cb(err)  
        }
        files.forEach(file => {
            processing++
            fs.readFile(path.join(dir, file), (err, data) => {

                if(err) {
                    return cb(err)
                }

                if (data.includes(word)) {
                    containingFiles.push(file)
                }

                if(--processing === 0) {
                    return cb(null, containingFiles)
                }
            })
        })

        // if (--processing === 0) {
        //     return cb(null, containingFiles)
        // }
    })
}

const test = path.resolve(__dirname, 'find')
recursiveFind(test, 'asd', (err, files) => {
    if (err) {
        console.error(err)  
    }

    console.log(files)
})
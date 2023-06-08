import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let processing = 0;
const totalFiles = [];
function listNestedFiles(dir, cb) {
    processing++;

    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
        if (err) {
            return cb(err);
        }

        files.forEach(file => {
            if (file.isDirectory()) {
                listNestedFiles(path.resolve(dir, file.name), cb);
            } else {
                totalFiles.push(file.name);
            }
        });

        if (--processing === 0) {
            return cb(null, totalFiles);
        }
    });
}

const dir = path.resolve(__dirname, "test");
listNestedFiles(dir, (err, files) => {
    if (err) {
        return console.error(err);
    }
    console.log(`NestedFiles: ${files}`);
});

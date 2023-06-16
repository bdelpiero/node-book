import fs from "fs";
import path from "path";
import { TaskQueue } from "./TaskQueue.js";

//TODO test functionality
export function recursiveFind(dir, word, cb) {
    const queue = new TaskQueue(2);
    const containingFiles = [];

    queue.on("empty", () => cb(null, containingFiles))
    queue.on("error", (err) => cb(err))
    
    function findInFile(file, word, cb) {
        fs.readFile(file, (err, data) => {
            if (err) {
                return cb(err);
            }
            
            if (data.includes(word)) {
                containingFiles.push(path.basename(file));
            }

            return cb()
        });
    }
    
    function recur(dir, cb) {
        fs.readdir(dir, { withFileTypes: true }, (err, files) => {
            if (err) {
                console.log('err', err)
                return cb(err);
            }
            if (!files.length) {
                return cb();
            }
            files.forEach(file => {
                if (file.isDirectory()) {
                    queue.pushTask((cb) => recur(path.resolve(dir, file.name), cb));
                } else {
                    queue.pushTask((cb) => findInFile(path.resolve(dir, file.name), word, cb));
                }
            });
            return cb();
        });
    }

    queue.pushTask((done) => recur(dir, done))
}

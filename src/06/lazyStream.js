// p198 create a lazy Readable and Writable stream
// i guess i should use a PassThrough stream to detect whether data is being processed and, in that case, create the stream instance passed to the lazy initializer
// maybe i could read the max number of open files that my version of node js supports:
    // keep a counter with opened streams
    // when the number is bigger than the limit, wait?
    // when the number is lower, create the stream
// this is the key (from the documentation)
  //Once the stream is accessed (for example when you call its read() method, or attach a data-event listener) the fn function is called with the outer lazystream.Readable instance bound to this.
// get to know the use of readableStreams. a readable stream will be "consumed" by a client? when are the events emmited? is there a way to know when the first event is getting triggered?

/****** lazystream is implemented using a PassThrough stream that, 
only when its _read() method is invoked for the first time, 
creates the proxied instance by invoking the factory function,
 and pipes the generated stream into the PassThrough itself 
 *******/

 // What is the diff between createReadStream(file) and Readable.from(file)

import fs from "fs";
import path from "path";

const FOLDER_PATH = "./empty_files";
const OPEN_UP_TO = 100000;

function createTestFiles() {
    if (!fs.existsSync(FOLDER_PATH)) {
        fs.mkdirSync(FOLDER_PATH);
    }

    for (let i = 0; i < 10; i++) {
        const filePath = path.join(FOLDER_PATH, `empty_file_${i}.txt`);
        const content = `This is line 1 of ${filePath}\nThis is line 2 of ${filePath}`;

        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, content, "utf-8");
            console.log(`Created and wrote to file: ${filePath}`);
        } else {
            console.log(`File already exists: ${filePath}`);
        }
    }
}

function openTooManyFiles() {
    let openedFiles = 0;
    let hasReachedLimit = false;

    for (let i = 0; i < OPEN_UP_TO; i++) {
        const fileNumber = i % 10;
        const filePath = path.join(FOLDER_PATH, `empty_file_${fileNumber}.txt`);
        const file = fs.createReadStream(filePath);

        openedFiles++;
        const current = openedFiles;

        file.on("error", err => {
            if (hasReachedLimit || err.code !== "EMFILE") return;
            hasReachedLimit = true;
            console.log(`Reached EMFILE error after opening ${current} files.`);
        });
    }
}

createTestFiles();
openTooManyFiles();

import { createFSAdapter } from "./fs-adapter.js";

const fs = createFSAdapter();

fs.writeFile("file.txt", "Hello!", err => {
    if (err) {
        console.error(err);
        return;
    }
    fs.readFile("file.txt", { encoding: "utf8" }, (err, res) => {
        if (err) {
            return console.error(err);
        }
        console.log(res);
    });
});

// try to read a missing file
fs.readFile("missing.txt", { encoding: "utf8" }, (err, res) => {
    console.error(err);
});

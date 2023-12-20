import fs from "fs";
import path from "path";

export function recursiveFind(dir, word, cb) {
  const containingFiles = [];
  let processing = 0;

  function findInFile(file, word, cb) {
    processing++;
    fs.readFile(file, (err, data) => {
      if (err) {
        return cb(err);
      }

      if (data && data.includes(word)) {
        containingFiles.push(path.basename(file));
      }

      if (--processing === 0) {
        return cb(null, containingFiles);
      }
    });
  }

  function recur(dir) {
    processing++;
    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
      if (err) {
        return cb(err);
      }
      if (files) {
        files.forEach((file) => {
          if (file.isDirectory()) {
            recur(path.resolve(dir, file.name), word, cb);
          } else {
            findInFile(path.resolve(dir, file.name), word, cb);
          }
        });
      }

      if (--processing === 0) {
        return cb(null, containingFiles);
      }
    });
  }

  recur(dir);
}

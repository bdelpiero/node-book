import fs from "fs";
import path from "path";

export function listNestedFiles(dir, cb) {
  let processing = 0;
  const totalFiles = [];

  function recur(dir) {
    processing++;

    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
      if (err) {
        return cb(err);
      }

      files.forEach((file) => {
        if (file.isDirectory()) {
          recur(path.resolve(dir, file.name), cb);
        } else {
          totalFiles.push(path.resolve(dir, file.name));
        }
      });

      if (--processing === 0) {
        return cb(null, totalFiles);
      }
    });
  }

  recur(dir);
}

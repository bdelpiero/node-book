import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// helper function taken from one of the authors of the book: https://gist.github.com/lmammino/ac91a7bde88c0f6c6962268d67e3ffbe
const iterateSeries = (collection, iteratorCallback, finalCallback) => {
  const stoppingPoint = collection.length;

  function iterate(index) {
    if (index === stoppingPoint) {
      return finalCallback();
    }
    const current = collection[index];
    iteratorCallback(current, (err) => {
      if (err) {
        return finalCallback(err);
      }
      return iterate(index + 1);
    });
  }

  iterate(0);
};

export function concatFiles(dest, cb, ...srcFiles) {
  let contents = "";
  const processFiles = (file, next) => {
    fs.readFile(file, (err, data) => {
      if (err) {
        return next(err);
      }
      contents += data;
      next();
    });
  };

  const writeDestFile = () => {
    fs.writeFile(dest, contents, (err) => {
      if (err) {
        return cb(err);
      }
      cb();
    });
  };

  return iterateSeries(srcFiles, processFiles, writeDestFile);
}

// test
const srcFiles = ["foo.txt", "bar.txt"].map((fileName) =>
  path.join(__dirname, fileName),
);
const destFile = path.join(__dirname, "result.txt");

concatFiles(
  destFile,
  (err) => {
    if (err) {
      return console.error(err);
    }
    console.log("finished processing files");
  },
  ...srcFiles,
);

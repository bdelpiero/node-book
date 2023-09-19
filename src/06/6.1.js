//Write a command-line script that takes a file as input and compresses it
// using the different algorithms available in the zlib module (Brotli, Deflate, Gzip).
// You want to produce a summary table that compares the algorithm's compression time and compression efficiency on the given file.
// Hint: This could be a good use case for the fork pattern, but remember that we made some important performance considerations when we discussed it earlier in this chapter.

import { createReadStream, createWriteStream } from "fs";
import { createBrotliCompress, createDeflate, createGzip } from "zlib";
import { dirname, join, parse } from "path";
import { fileURLToPath } from "url";
import { trackPerformance } from "./trackPerformance.js";

const FILE_EXTENSION = {
    ["GZIP"]: "gz",
    ["Deflate"]: "zz",
    ["Brotli"]: "br",
};

const file = process.argv[2];
const filename = parse(file).name;
const currentDir = dirname(fileURLToPath(import.meta.url));
const outDir = join(currentDir, "output_files");
const inputDir = join(currentDir, "input_files");
const inputFile = join(inputDir, file);

const inputStream = createReadStream(inputFile);

function compress(algo, compressFn) {
    const outFile = join(outDir, `${filename}.${FILE_EXTENSION[algo]}`);
    return inputStream
        .pipe(compressFn())
        .pipe(trackPerformance(algo))
        .pipe(createWriteStream(outFile));
}

compress("GZIP", createGzip);
compress("Deflate", createDeflate);
compress("Brotli", createBrotliCompress);

import { createReadStream } from "fs";
import { createBrotliCompress, createDeflate, createGzip } from "zlib";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { pipeline, PassThrough } from "stream";
import { hrtime } from "process";

let compressing = 0;
const stats = {
    input: {},
    gzip: {},
    brotli: {},
    deflate: {},
};

function startTimer(key) {
    const stream = new PassThrough();
    stream.once("data", () => {
        compressing++;
        stats[key].startTimestamp = hrtime.bigint();
    });
    return stream;
}

function endTimer(key) {
    const stream = new PassThrough();
    stream.on("end", () => {
        const endTime = hrtime.bigint();
        const startTime = stats[key].startTimestamp;
        stats[key].compressionTime = endTime - startTime;
    });
    return stream;
}

function monitorSize(key) {
    const tracker = new PassThrough();

    let size = 0;

    tracker.on("data", chunk => {
        size += chunk.length;
    });

    tracker.on("finish", () => {
        stats[key].size = size;
    });

    return tracker;
}

function done(err) {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    if (--compressing === 0) {
        const results = [];

        console.log(`Size of input file before compression: ${stats.input.size}`);
        delete stats.input;

        for (const algorithm of Object.keys(stats)) {
            const { compressionTime, size } = stats[algorithm];
            results.push({ algorithm, compressionTime, size });
        }

        console.table(results);
    }
}

function compress(algo, compressFn, inputStream) {
    pipeline(
        inputStream,
        monitorSize("input"),
        startTimer(algo),
        compressFn(),
        endTimer(algo),
        monitorSize(algo),
        done
    );
}

function main() {
    const file = process.argv[2];
    const currentDir = dirname(fileURLToPath(import.meta.url));
    const inputDir = join(currentDir, "input_files");
    const inputFile = join(inputDir, file);
    const inputStream = createReadStream(inputFile);

    compress("gzip", createGzip, inputStream);
    compress("deflate", createDeflate, inputStream);
    compress("brotli", createBrotliCompress, inputStream);
}

main();

// simple cli program to decompress a file
// decompress(file, format)
// should check if the files format is supported (get the file format based on the extension?)
import { createWriteStream, createReadStream } from "fs";
import { dirname, extname, join, parse } from "path";
import { pipeline } from "stream";
import { fileURLToPath } from "url";
import {
  createBrotliDecompress,
  createGunzip,
  createInflate,
  createUnzip,
} from "zlib";

const FILE_EXTENSION_TO_DECOMPRESS_ALGORITHM = {
  zz: createInflate,
  gz: createGunzip,
  br: createBrotliDecompress,
};

function main() {
  const filename = process.argv[2];
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const dir = join(currentDir, "input_files");
  const inputFile = join(dir, filename);
  const outFile = join(dir, parse(inputFile).name);

  const extension = extname(filename).slice(1);
  const decompressAlgo = FILE_EXTENSION_TO_DECOMPRESS_ALGORITHM[extension];

  if (!decompressAlgo) {
    console.error("File extension not supported");
    process.exit(1);
  }

  pipeline(
    createReadStream(inputFile),
    decompressAlgo(),
    createWriteStream(outFile),
    (err) => {
      if (err) {
        console.error("error decompressing file: ", err);
        process.exit(1);
      }
      console.log("done decompressing file");
      process.exit(0);
    },
  );
}

main();

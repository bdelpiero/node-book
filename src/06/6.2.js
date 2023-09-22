import { createReadStream, createWriteStream } from "fs";
import { dirname, join } from "path";
import { pipeline } from "stream";
import { fileURLToPath } from "url";
import { parse } from "csv-parse";
import { HasCrimeIncreased } from "./6.2.helpers/HasCrimeIncreased.js";

const currentDir = dirname(fileURLToPath(import.meta.url));
const inputDir = join(currentDir, "input_files");
// file can be downloaded from: https://www.kaggle.com/datasets/jboysen/london-crime?resource=download&select=london_crime_by_lsoa.csv
//  const file = join(inputDir, "london_crime_by_lsoa.csv");
const file = join(inputDir, "small_sample.csv");

const csvParser = parse({ columns: true });


pipeline(
    createReadStream(file),
    csvParser,
    new HasCrimeIncreased(),
    process.stdout,
    err => {
        if (err) {
            console.error("error parsing file: ", err);
            process.exit(1);
        }
        console.log("done reading file");
        process.exit(0);
    }
);

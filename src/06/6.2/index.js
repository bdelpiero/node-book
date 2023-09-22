import { createReadStream, createWriteStream } from "fs";
import { dirname, join } from "path";
import { pipeline } from "stream";
import { fileURLToPath } from "url";
import { parse } from "csv-parse";
import pumpify from "pumpify";
import { HasCrimeIncreased } from "./HasCrimeIncreased.js";
import { MostDangerous } from "./MostDangerous.js";
import { MostCommonCrimePerArea } from "./MostCommonCrimePerArea.js";

const currentDir = dirname(fileURLToPath(import.meta.url));
const inputDir = join(currentDir, "../input_files");
// file can be downloaded from: https://www.kaggle.com/datasets/jboysen/london-crime?resource=download&select=london_crime_by_lsoa.csv
const file = join(inputDir, "london_crime_by_lsoa.csv");
// const file = join(inputDir, "small_sample.csv");

const inputStream = createReadStream(file);
const csvParser = parse({ columns: true });
const mainStream = pumpify.obj(inputStream, csvParser);

// these transform streams could be replaced with pass through ones, as im not interested on their writeable side
[HasCrimeIncreased, MostDangerous, MostCommonCrimePerArea].forEach(Stream => {
    pipeline(mainStream, new Stream(), err => {
        if (err) {
            console.error("error parsing file: ", err);
            process.exit(1);
        }
        console.log("done reading file");
        process.exit(0);
    });
});

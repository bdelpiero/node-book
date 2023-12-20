import { createReadStream, createWriteStream } from "fs";
import { dirname, join } from "path";
import { pipeline } from "stream";
import { fileURLToPath } from "url";
import { parse } from "csv-parse";
import pumpify from "pumpify";
import { hasCrimeIncreased } from "./hasCrimeIncreased.js";
import { leastCommonCrime } from "./leastCommonCrime.js";
import { mostCommonCrimePerArea } from "./MostCommonCrimePerArea.js";
import { mostDangerousArea } from "./mostDangerousArea.js";

// file can be downloaded from: https://www.kaggle.com/datasets/jboysen/london-crime?resource=download&select=london_crime_by_lsoa.csv
const file = join(inputDir, "london_crime_by_lsoa.csv");

const currentDir = dirname(fileURLToPath(import.meta.url));
const inputDir = join(currentDir, "../input_files");

const inputStream = createReadStream(file);
const csvParser = parse({ columns: true });
const mainStream = pumpify.obj(inputStream, csvParser);

const analyzers = [
  hasCrimeIncreased,
  mostDangerousArea,
  mostCommonCrimePerArea,
  leastCommonCrime,
];

analyzers.forEach((analyze) => {
  pipeline(mainStream, analyze(), (err) => {
    if (err) {
      console.error("error parsing file: ", err);
      process.exit(1);
    }
    console.log("done reading file");
    process.exit(0);
  });
});

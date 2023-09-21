// it suggests to use transform streams and fork
// maybe the idea is to first transform the incoming data in some way (parsing it, for example)
// and then fork that transformed stream to be processed by the different forked streams

// i think i shouldnt use a tranform stream in any forked pipeline. could it mutate the data for the other streams?
// no, transform doesnt mutate per se the original data, just if it performs a mutating side effect.
// if it transforms(without mutation, like aggregating)/filters the data, it shouldnt have an impact on the rest of the forks
import { pipeline } from "stream";

const currentDir = dirname(fileURLToPath(import.meta.url));
const inputDir = join(currentDir, "input_files");
const file = join(inputDir, "london_crime_by_lsoa.csv");

const csvParser = parse({ columns: true });

pipeline(createReadStream(file), csvParser, err => {
    if (err) {
        console.error("error parsing file");
        process.exit(1);
    }
    console.log("done reading file");
    process.exit(0);
});

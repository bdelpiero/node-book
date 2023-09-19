import { PassThrough } from "stream";

const trackers = {};
let tracking = 0;

function track(algo) {
    const tracker = new PassThrough();
    trackers[algo] = tracker;

    tracking++;
    let startTime;
    let endTime;
    let bytesWritten = 0;

    tracker.on("data", chunk => {
        startTime = performance.now();
        bytesWritten += chunk.length;
    });

    tracker.on("finish", () => {
        endTime = performance.now();

        trackers[algo].elapsedTime = endTime - startTime;
        trackers[algo].bytesWritten = bytesWritten;

        if (--tracking === 0) {
            const results = [];

            for (const algorithm of Object.keys(trackers)) {
                const { elapsedTime, bytesWritten } = trackers[algorithm];
                results.push({ algorithm, elapsedTime, bytesWritten });
            }

            console.table(results);
        }
    });

    return tracker;
}

export function trackPerformance(algo) {
    return track(algo);
}

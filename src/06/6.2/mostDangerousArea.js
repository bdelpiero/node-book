import { PassThrough } from "stream";

export function mostDangerousArea() {
    const stream = new PassThrough({ objectMode: true });

    const boroughTotals = {};

    stream.on("data", ({ borough, value }) => {
        boroughTotals[borough] = boroughTotals[borough] || 0;
        boroughTotals[borough] += Number(value);
    });

    stream.on("end", () => {
        const boroughs = Object.keys(boroughTotals);

        const mostDangerousBorough = boroughs.reduce((mostDangerous, borough) => {
            return boroughTotals[borough] > boroughTotals[mostDangerous] ? borough : mostDangerous;
        }, boroughs[0]);

        console.log(`The most dangerous area of London is ${mostDangerousBorough}`);
    });

    return stream;
}

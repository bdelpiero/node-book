import { PassThrough } from "stream";

export function mostCommonCrimePerArea() {
    const stream = new PassThrough({ objectMode: true });

    const boroughTotalsPerCategory = {};

    stream.on("data", ({ borough, major_category, value }) => {
        const crimes = Number(value);

        if (!boroughTotalsPerCategory[borough]) {
            boroughTotalsPerCategory[borough] = { [major_category]: crimes };
        } else if (!boroughTotalsPerCategory[borough][major_category]) {
            boroughTotalsPerCategory[borough][major_category] = crimes;
        } else {
            boroughTotalsPerCategory[borough][major_category] += crimes;
        }
    });

    stream.on("end", () => {
        const boroughs = Object.keys(boroughTotalsPerCategory);

        const mostCommonCrimePerBorough = boroughs.map(borough => {
            const boroughTotals = boroughTotalsPerCategory[borough];
            const categories = Object.keys(boroughTotals);

            const mostCommonCategory = categories.reduce((mostCommon, category) => {
                return boroughTotals[category] > boroughTotals[mostCommon] ? category : mostCommon;
            }, categories[0]);

            return { borough, mostCommonCategory };
        });

        console.table(mostCommonCrimePerBorough);
    });

    return stream;
}

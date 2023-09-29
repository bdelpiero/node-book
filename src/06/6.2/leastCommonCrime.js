import { PassThrough } from "stream";

export function leastCommonCrime() {
    const stream = new PassThrough({ objectMode: true });

    const crimesPerCategory = {};

    stream.on("data", ({ major_category, value }) => {
        crimesPerCategory[major_category] = crimesPerCategory[major_category] || 0;
        crimesPerCategory[major_category] += Number(value);
    });

    stream.on("end", () => {
        const categories = Object.keys(crimesPerCategory);

        const leastCommonCategory = categories.reduce((leastCommon, category) => {
            return crimesPerCategory[category] < crimesPerCategory[leastCommon]
                ? category
                : leastCommon;
        }, categories[0]);

        console.log(`The least common crime in London is ${leastCommonCategory}`);
    });

    return stream;
}

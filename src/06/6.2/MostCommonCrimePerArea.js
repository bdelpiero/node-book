import { Transform } from "stream";


export class MostCommonCrimePerArea extends Transform {
    constructor(options = {}) {
        options.objectMode = true;
        super(options);
        this.boroughTotalsPerCategory = {};
    }

    _transform({borough, major_category, value}, _, cb) {
        const crimes = Number(value);

        if (!this.boroughTotalsPerCategory[borough]) {
            this.boroughTotalsPerCategory[borough] = { [ major_category ] : crimes };
        } else if (!this.boroughTotalsPerCategory[borough][major_category]) {
            this.boroughTotalsPerCategory[borough][major_category] = crimes;
        } else {
            this.boroughTotalsPerCategory[borough][major_category] += crimes;            
        }

        cb()
    }

    _flush(cb) {
        const boroughs = Object.keys(this.boroughTotalsPerCategory);
        
        const mostCommonCrimePerBorough = boroughs.map(borough => {
            const boroughTotalsPerCategory = this.boroughTotalsPerCategory[borough];
            const categories = Object.keys(boroughTotalsPerCategory);

            const mostCommonCategory = categories.reduce((mostCommon, category) => {
                return boroughTotalsPerCategory[category] > boroughTotalsPerCategory[mostCommon] ? category : mostCommon;
            }, categories[0]);

            return { borough, mostCommonCategory}
        })

        console.table(mostCommonCrimePerBorough)

        cb()
    }
}
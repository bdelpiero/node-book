import { Transform } from "stream";

export class HasCrimeIncreased extends Transform {
    constructor(options = {}) {
        options.objectMode = true;
        super(options);
        this.yearlyTotals = {};
    }

    // push isn't called, so no data is emitted while accumulating totals
    _transform({year, value}, _, cb) {
        const crimes = Number(value);
        this.yearlyTotals[year] = this.yearlyTotals[year] || 0;
        this.yearlyTotals[year] += crimes;
        cb();
    }

    // will be called when all data has been processed
    _flush(cb) {
        const years = Object.keys(this.yearlyTotals).sort();
        const firstYearTotal = this.yearlyTotals[years[0]];
        const lastYearTotal = this.yearlyTotals[years[years.length - 1]];
        const percentageChange =
            ((lastYearTotal - firstYearTotal) / firstYearTotal) * 100;
        const result =
            lastYearTotal < firstYearTotal
                ? `Crime has decreased by ${Math.abs(percentageChange).toFixed(
                      2
                  )}%`
                : firstYearTotal < lastYearTotal
                ? `Crime has increased by ${Math.abs(percentageChange).toFixed(
                      2
                  )}%`
                : "Crime has remained the same";

        this.push(result + "\n");
        cb();
    }
}

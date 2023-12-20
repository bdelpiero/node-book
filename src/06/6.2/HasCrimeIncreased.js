import { PassThrough } from "stream";

export function hasCrimeIncreased() {
  const stream = new PassThrough({ objectMode: true });

  const yearlyTotals = {};

  stream.on("data", ({ year, value }) => {
    yearlyTotals[year] = yearlyTotals[year] || 0;
    yearlyTotals[year] += Number(value);
  });

  stream.on("end", () => {
    const years = Object.keys(yearlyTotals).sort();
    const firstYearTotal = yearlyTotals[years[0]];
    const lastYearTotal = yearlyTotals[years[years.length - 1]];
    const percentageChange =
      ((lastYearTotal - firstYearTotal) / firstYearTotal) * 100;
    const result =
      lastYearTotal < firstYearTotal
        ? `Crime has decreased by ${Math.abs(percentageChange).toFixed(2)}%`
        : firstYearTotal < lastYearTotal
          ? `Crime has increased by ${Math.abs(percentageChange).toFixed(2)}%`
          : "Crime has remained the same";

    console.log(result);
  });

  return stream;
}

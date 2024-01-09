import level from "level";
import { EventEmitter } from "events";
import sublevel from "subleveldown";

const db = level("example-db");
const salesDb = sublevel(db, "sales", { valueEncoding: "json" });

/**
 *
 * @param {object} product
 * @param {Function} cb
 * @returns
 */
export function totalSales(product, cb) {
  const now = Date.now();
  let sum = 0;

  const salesDbStream = salesDb.createValueStream();

  salesDbStream
    .on("data", transaction => {
      if (!product || transaction.product === product) {
        sum += transaction.amount;
      }
    })
    .on("end", () => {
      console.log(`totalSales() took: ${Date.now() - now}ms`);
      cb(null, sum);
    })
    .on("error", err => {
      cb(err);
    });
}

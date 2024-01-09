import { EventEmitter } from "events";
import { totalSales as totalSalesRaw } from "./totalSales.js";

// holds instances of EventEmitter as values
const runningRequests = new Map();

/**
 * @param {object} product
 * @param {Function} cb
 * @returns
 */
export function totalSales(product, cb) {
  if (runningRequests.has(product)) {
    console.log("Batching");
    return runningRequests
      .get(product)
      .on(
        "done",
        /** @param {Number} sum*/ sum => {
          cb(null, sum);
        }
      )
      .on(
        "error",
        /** @param {any} err*/ err => {
          cb(err);
        }
      );
  }

  const resultEmitter = new EventEmitter();
  runningRequests.set(product, resultEmitter);
  resultEmitter.on("done", () => {
    runningRequests.delete(product);
  });

  /**
   * @param {any} err
   * @param {number} sum
   */
  const cbWrapper = (err, sum) => {
    if (err) {
      cb(err);
      return resultEmitter.emit("error", err);
    }

    cb(null, sum);
    return resultEmitter.emit("done", sum);
  };

  return totalSalesRaw(product, cbWrapper);
}

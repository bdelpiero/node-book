import { EventEmitter } from "events";
import { totalSales as totalSalesRaw } from "./totalSales.js";

const CACHE_TTL = 30 * 1000; // 30 seconds TTL
const cache = new Map();
const resultEmitters = new Map();

/**
 * @param {object} product
 * @param {Function} cb
 * @returns
 */
export function totalSales(product, cb) {
  if (cache.has(product)) {
    console.log("Cache hit");
    return cb(null, cache.get(product));
  }

  if (resultEmitters.has(product)) {
    console.log("Batching");
    return resultEmitters
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

  const resultEmitter = new EventEmitter().setMaxListeners(25);
  resultEmitters.set(product, resultEmitter);
  resultEmitter
    .on("done", () => {
      setTimeout(() => {
        console.log("Deleting cache");
        cache.delete(product);
      }, CACHE_TTL);
    })
    .on("err", err => {
      cache.delete(err);
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

    resultEmitter.emit("done", sum);
    cache.set(product, sum);
    cb(null, sum);
  };

  return totalSalesRaw(product, cbWrapper);
}

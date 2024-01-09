import { createServer } from "http";
// import { totalSales } from './totalSales.js'
import { totalSales } from "./totalSalesBatch.js";
// import { totalSales } from './totalSalesCache.js'

createServer((req, res) => {
  if (!req.url) {
    res.writeHead(400);
    return res.end("url param is required");
  }

  const url = new URL(req.url, "http://localhost");
  const product = url.searchParams.get("product");
  console.log(`Processing query: ${url.search}`);

  /**
   * @param {any} err
   * @param {number} sum
   */
  const cb = (err, sum) => {
    if (err) {
      res.writeHead(500);
      return res.end(`Error ocurred while processing total sales: ${err.message}`);
    }

    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(
      JSON.stringify({
        product,
        sum,
      })
    );
  };

  totalSales(product, cb);
}).listen(8000, () => console.log("Server started"));

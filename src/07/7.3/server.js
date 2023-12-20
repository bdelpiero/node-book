import { createServer } from "http";
import TamperFreeQueue from "./TamperFreeQueue.js";

function startServer(enqueue) {
  const server = createServer((req, res) => {
    if (req.method === "POST") {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      // When the entire message is received
      req.on("end", () => {
        const message = JSON.parse(body);

        enqueue(message);

        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Message received\n");
      });
    } else {
      res.end("Incorrect http method\n");
    }
  });

  server.listen(3000, () => console.log("Listening on http://localhost:3000"));
}

async function main() {
  const queue = new TamperFreeQueue(startServer);

  //My original implementation
  // function dequeueIter(queue) {
  //     queue.dequeue(message => {
  //         console.log(`Retrieved message from queue: ${message}`);
  //         // dequeueIter(queue)
  //     });
  // }

  // better solution to keep 'subscribed' to the queue (taken from one of the solutions available)
  while (true) {
    const word = await queue.dequeue();
    console.log("Retrieved message from queue: %s", word);
  }
}

main();

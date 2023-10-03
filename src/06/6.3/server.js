import { createWriteStream } from "fs";
import { join } from "path";
import { createServer } from "net";
import { createDecipheriv, randomBytes } from "crypto";
import { Transform } from "stream";
import pumpify from "pumpify";
import { PORT } from "./const.js";

// TODO: limit concurrency?
function demultiplexChannel(source, destinations = {}) {
    let currentFileNameLength = null;
    let currentContentLength = null;
    let file = null;
    let iv = null;

    source
        .on("readable", () => {
            let chunk;

            // get the length of the filename
            if (currentFileNameLength === null) {
                chunk = source.read(4);
                currentFileNameLength = chunk && chunk.readUInt32BE(0);
                if (currentFileNameLength === null) {
                  return null;
              }
            }

            // get the length of the file content
            if (currentContentLength === null) {
                chunk = source.read(4);
                currentContentLength = chunk && chunk.readUInt32BE(0);
                if (currentContentLength === null) {
                    return null;
                }
            }

            // get the iv
            if (iv === null) {
                chunk = source.read(16);
                iv = chunk;
                if (!iv) {
                    return null;
                }
            }

            // get the filename to be used as destination
            if (file === null) {
                chunk = source.read(currentFileNameLength);
                file = chunk && chunk.toString("utf8");
                if (!file) {
                    console.error("No file name received for current packet");
                    return null;
                }
            }

            if (!destinations[file]) {
                destinations[file] = pumpify(
                    createDecipheriv("aes192", secret, iv),
                    new Transform({
                        defaultEncoding: "utf8",
                        transform(chunk, _, cb) {
                            const str = chunk.toString("utf8");
                            this.push(str);
                            cb();
                        },
                    }),
                    createWriteStream(join("output", file))
                );

                destinations[file].on("error", err => {
                    console.error("error parsing data: ", err.message);
                });
            }

            // get file content
            chunk = source.read(currentContentLength);
            if (chunk === null) {
                return null;
            }
            
            destinations[file].write(chunk);

            currentFileNameLength = null;
            currentContentLength = null;
            file = null;
            iv = null;
        })

        // TODO close the connections when all the destinations are done writing?
        .on("end", () => {
            Object.values(destinations).forEach(destination => destination.end());
            console.log("Source channel closed");
        });
}

const secret = randomBytes(24);
console.log(`Generated secret: ${secret.toString("hex")}`);

const server = createServer(socket => {
    const remoteAddress = socket.remoteAddress + ":" + socket.remotePort;
    console.log(`new client connection from ${remoteAddress}`);

    demultiplexChannel(socket);
});

//use nc localhost PORT from terminal to test connection
server.listen(PORT, () => console.log("Server started on port ", PORT));

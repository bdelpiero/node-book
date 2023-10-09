import { createWriteStream } from "fs";
import { join } from "path";
import { createServer } from "net";
import { createDecipheriv, randomBytes } from "crypto";
import { Transform } from "stream";
import pumpify from "pumpify";
import { PORT } from "./const.js";

function createDestinationStream(file, secret, iv) {
    const destination = pumpify(
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

    // should improve error handling for each peace of the pipe
    destination.on("error", err => {
        console.error("error parsing data: ", err.message);
    });

    return destination;
}


// some chunks sent by the client seem to be merged by the tcp communication
// resulting in data loss with my approach.
// i could check if there is any data left to read and, if so,
// process whatever is left as if it was a new chunk (which it was from the perspective of the client)
// using the 'data' event instead of 'readable' may make this easier (see https://github.com/levanchien/Node.js-Design-Patterns-Exercise/blob/master/chap-06/6.3/server.mjs)
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

            // get file content
            chunk = source.read(currentContentLength);
            if (chunk === null) {
                return null;
            }

            destinations[file] = destinations[file] || createDestinationStream(file, secret, iv);
            destinations[file].write(chunk);

            currentFileNameLength = null;
            currentContentLength = null;
            file = null;
            iv = null;
        })
        .on("end", () => {
            console.log("Source channel closed");
            Object.values(destinations).forEach(destination => destination.end());
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

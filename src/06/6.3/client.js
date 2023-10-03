import { connect } from "net";
import { createReadStream } from "fs";
import { createCipheriv, randomBytes } from "crypto";
import { basename } from "path";
import { PORT } from "./const.js";

const secret = Buffer.from(process.argv[2], "hex");
const files = ["test.txt", "test1.txt", "test3.txt"];

// TODO add lazy initialization for read stream?
function multiplexChannels(files, destination) {
    let openChannels = files.length;
    for (const file of files) {
        const fileName = basename(file)
        const fileNameBytes = Buffer.from(fileName, 'utf8');
        const iv = randomBytes(16);

        createReadStream(file)
            .pipe(createCipheriv("aes192", secret, iv))
            .on("readable", function () {
                let chunk;
                while ((chunk = this.read()) !== null) {
                    const outBuff = Buffer.alloc(4 + 4 + 16 + fileNameBytes.length + chunk.length);
                    // length of the filename
                    outBuff.writeUInt32BE(fileNameBytes.length, 0);
                    // length of the chunk read from the file
                    outBuff.writeUInt32BE(chunk.length, 4);
                    // iv
                    iv.copy(outBuff, 4 + 4, 0, 16);
                    // filename
                    fileNameBytes.copy(outBuff, 4 + 4 + 16);
                    // chunk of data from the file
                    chunk.copy(outBuff, 4 + 4 + 16 + fileNameBytes.length);
                    console.log(`Sending packet for file: ${file}`);
                    destination.write(outBuff);
                }
            })
            .on("end", () => {
                if (--openChannels === 0) {
                    destination.end();
                }
            });
    }
}

const socket = connect(PORT, () => {
    multiplexChannels(files, socket);
});

socket.on("error", e => console.error(`Error connecting to port: ${PORT}: ${e.message}`));

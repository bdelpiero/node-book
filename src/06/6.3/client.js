import { connect } from "net";
import { createReadStream } from "fs";
import { createCipheriv, randomBytes } from "crypto";
import { basename } from "path";
import { PORT } from "./const.js";

const secret = Buffer.from(process.argv[2], "hex");
const files = [];

function multiplexChannels(files, destination) {
  let openChannels = files.length;
  for (const file of files) {
    const fileName = basename(file);
    const fileNameBytes = Buffer.from(fileName, "utf8");
    const iv = randomBytes(16);

    /**
     * got this idea from solutions
     *
     * set a highwatermark taking into account
     * 4 bytes for filename length
     * 4 bytes for chunk length
     * 16 bytes for iv
     * filename in bytes
     */
    createReadStream(file, {
      highWaterMark: 64 * 1024 - 4 - 4 - 16 - fileNameBytes.length,
    })
      .pipe(createCipheriv("aes192", secret, iv))
      .on("readable", function () {
        let chunk;
        while ((chunk = this.read()) !== null) {
          const outBuff = Buffer.alloc(
            4 + 4 + 16 + fileNameBytes.length + chunk.length,
          );

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

          // at most i'll be sending 64 * 1024 bytes (64 kb)
          console.log(
            `Sending packet for file: ${file} of size ${chunk.length}`,
          );
          destination.write(outBuff);
        }
      })
      .on("error", (err) => {
        console.error("error processing file ", err);
      })
      .on("end", () => {
        if (--openChannels === 0) {
          console.log("closing connection");
          destination.end();
        }
      });
  }
}

const socket = connect(PORT, () => {
  multiplexChannels(files, socket);
});

socket.on("error", (e) =>
  console.error(`Error connecting to port: ${PORT}: ${e.message}`),
);

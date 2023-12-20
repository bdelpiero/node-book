import { appendFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, "logs");

export const serializeMiddleware = () => (message) => JSON.stringify(message);

export const saveToFileMiddleware = () => async (message) => {
  await appendFile(
    path.join(logDir, "logs.txt"),
    `${new Date()}: ${message}\n`,
  );
  return message;
};

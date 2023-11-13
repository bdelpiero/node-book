import { appendFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function logToFile(msg, file) {
    const logDir = path.join(__dirname, "logs");
    if (!existsSync(logDir)) {
        mkdirSync(logDir);
    }
    appendFileSync(path.join(logDir, file), `${new Date()}: ${msg}\n`);
}

export const fileStrategy = {
    error: msg => logToFile(msg, "error.txt"),
    warn: msg => logToFile(msg, "warn.txt"),
    debug: msg => logToFile(msg, "debug.txt"),
    info: msg => logToFile(msg, "info.txt"),
};

export const consoleStrategy = {
    error: console.error,
    warn: console.warn,
    debug: console.debug,
    info: console.info,
};

import { appendFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class LoggerTemplate {
  debug(msg) {
    throw new Error("debug must be implemented");
  }
  warn(msg) {
    throw new Error("warn must be implemented");
  }
  info(msg) {
    throw new Error("info must be implemented");
  }
  error(msg) {
    throw new Error("error must be implemented");
  }
}

class ConsoleLogger extends LoggerTemplate {
  error(msg) {
    return console.error(msg);
  }
  warn(msg) {
    return console.warn(msg);
  }
  debug(msg) {
    return console.debug(msg);
  }
  info(msg) {
    return console.info(msg);
  }
}

class FileLogger extends LoggerTemplate {
  constructor(logDir) {
    super();
    this.logDir = logDir;
  }
  error(msg) {
    return this._logToFile(msg, "error.txt");
  }
  warn(msg) {
    return this._logToFile(msg, "warn.txt");
  }
  debug(msg) {
    return this._logToFile(msg, "debug.txt");
  }
  info(msg) {
    return this._logToFile(msg, "info.txt");
  }

  _logToFile(msg, file) {
    const logDir = path.join(__dirname, this.logDir);
    if (!existsSync(logDir)) {
      mkdirSync(logDir);
    }
    appendFileSync(path.join(logDir, file), `${new Date()}: ${msg}\n`);
  }
}

async function main() {
  const consoleLogger = new ConsoleLogger();
  consoleLogger.info("Hello");
  consoleLogger.warn("Hello");
  consoleLogger.debug("Hello");
  consoleLogger.error("Hello");

  const fileLogger = new FileLogger("logs");
  fileLogger.info("Hello");
  fileLogger.warn("Hello");
  fileLogger.debug("Hello");
  fileLogger.error("Hello");
}

main();

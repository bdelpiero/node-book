import { Logger } from "./logger.js";
import { consoleStrategy, fileStrategy } from "./strategies.js";

async function main() {
  const consoleLogger = new Logger(consoleStrategy);
  consoleLogger.info("Hello");
  consoleLogger.warn("Hello");
  consoleLogger.debug("Hello");
  consoleLogger.error("Hello");

  const fileLogger = new Logger(fileStrategy);
  fileLogger.info("Hello");
  fileLogger.warn("Hello");
  fileLogger.debug("Hello");
  fileLogger.error("Hello");
}

main();

export class Logger {
  constructor(loggingStrategy) {
    this.loggingStrategy = loggingStrategy;
  }

  debug(message) {
    this.loggingStrategy.debug(message);
  }

  info(message) {
    this.loggingStrategy.info(message);
  }

  warn(message) {
    this.loggingStrategy.warn(message);
  }

  error(message) {
    this.loggingStrategy.error(message);
  }
}

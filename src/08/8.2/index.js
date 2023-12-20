const consoleHandler = {
  get: (target, property) => {
    if (["log", "debug", "info", "error"].includes(property)) {
      return (message, ...optionalParams) => {
        const timestamp = new Date().toISOString();
        const enhancedMessage = `${timestamp} ${message}`;
        return target[property](enhancedMessage, ...optionalParams);
      };
    }

    return target[property];
  },
};

const consoleProxy = new Proxy(console, consoleHandler);

consoleProxy.log("Hello", "log");
consoleProxy.info("Hello info");
consoleProxy.debug("Hello debug");
consoleProxy.error("Hello error");

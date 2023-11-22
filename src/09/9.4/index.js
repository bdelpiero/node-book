import { LoggingMiddlewareManager } from "./LoggingMiddlewareManager.js";
import { serializeMiddleware, saveToFileMiddleware } from "./middlewares.js";

function main() {
    const mwm = new LoggingMiddlewareManager();
    mwm.use(serializeMiddleware());
    mwm.use(saveToFileMiddleware());

    mwm.log("First message");
    mwm.log("Second message");
    mwm.log("Third message");
    mwm.log("Fourth message");
}

main();

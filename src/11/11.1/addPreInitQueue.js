import { EventEmitter } from "events";

export function addPreInitQueue(target, methods, eventName) {
  if (!(target instanceof EventEmitter)) {
    throw new TypeError("target obj must be an instance of EventEmitter");
  }

  let initialized = false;
  let commandsQueue = [];

  target.once(eventName, () => {
    console.log(
      `Initialization event ${eventName} received. Running queued commands...`,
    );
    initialized = true;
    commandsQueue.forEach((command) => command());
    commandsQueue = [];
  });

  const handler = {
    get: (target, property) => {
      if (!methods.includes(property) || initialized) {
        return target[property];
      }

      return (...args) => {
        console.log(
          `Call to ${property} queued with args ${JSON.stringify(args)}`,
        );
        return new Promise((resolve, reject) => {
          const command = () => {
            target[property](...args).then(resolve, reject);
          };
          commandsQueue.push(command);
        });
      };
    },
  };

  return new Proxy(target, handler);
}

export class LoggingMiddlewareManager {
  constructor() {
    this.middlewares = [];
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  log(msg) {
    this.executeMiddlewares(msg);
  }

  async executeMiddlewares(initialMessage) {
    let message = initialMessage;
    for await (const middlewareFunc of this.middlewares) {
      console.log(message);
      message = await middlewareFunc(this, message);
    }
    return message;
  }
}

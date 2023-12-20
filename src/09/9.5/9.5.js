// not properly tested
// haven't found a way to correctly handle concurrency limit (solutions posted by others don't handle this case)
export class AsyncQueue {
  constructor() {
    this.queue = [];
    this.running = 0;
  }

  enqueue(task) {
    this.queue.push(task);
  }

  // am i correctly handling concurrency? (how to put a limit to the amount of iterators that can be created?)
  // i could maybe pause the iterator by returning a promise that does not resolve
  // and resolve it later on when the concurrency is freed. sth like TaskQueuePC example from chapter 5
  // (but this is not trivial i think)
  async [Symbol.asyncIterator]() {
    const self = this;
    return {
      async next() {
        const task = self.queue.shift();

        if (!task && self.running === 0) {
          return { done: true };
        }

        // there seems to be a pending task being handled by another iterator instance
        // check back in 5 secs
        if (!task) {
          await sleep(5000);
          return { done: false };
        }

        try {
          self.running++;
          const value = await task();
          return {
            done: false,
            value,
          };
        } catch (err) {
          return {
            done: false,
            value: `${err}`,
          };
        } finally {
          self.running--;
        }
      },
    };
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

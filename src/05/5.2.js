export class TaskQueue {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  // the resolve/reject handlers of the Promise are being added to the queue,
  // not the task itself. This way, if a task throws an error,
  // the Promise that was returned originally by runTask will be rejected.
  runTask(task) {
    return new Promise((resolve, reject) => {
      const taskWrapper = async () => {
        try {
          const result = await task();
          return resolve(result);
        } catch (error) {
          console.log("error");
          reject(error);
        }
      };

      this.queue.push(taskWrapper);
      process.nextTick(this.next.bind(this));
    });
  }

  async next() {
    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift();
      this.running++;
      try {
        await task();
      } finally {
        this.running--;
        this.next();
      }
    }
  }
}

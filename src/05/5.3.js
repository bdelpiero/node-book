export class TaskQueuePC {
  constructor(concurrency) {
    this.taskQueue = [];
    this.consumerQueue = [];

    // spawn consumers
    for (let i = 0; i < concurrency; i++) {
      this.consumer();
    }
  }

  consumer() {
    return new Promise((_, reject) => {
      const loop = () => {
        this.getNextTask()
          .then((task) => task())
          .then((val) => {
            console.log(val);
            // the call to loop shouldn't be returned by the promise
            // to avoid a leaking loop?
            loop();
          })
          .catch(reject);
      };

      loop();
    });
  }

  getNextTask() {
    return new Promise((resolve) => {
      if (this.taskQueue.length !== 0) {
        return resolve(this.taskQueue.shift());
      }

      // puts the consumer to sleep.
      // As resolve is never called,
      // the consumer will await for the
      // resolution of getNextTask() until 'awaken'
      // inside runTask
      this.consumerQueue.push(resolve);
    });
  }

  runTask(task) {
    return new Promise((resolve, reject) => {
      const taskWrapper = () => {
        const taskPromise = task();
        taskPromise.then(resolve, reject);
        return taskPromise;
      };

      if (this.consumerQueue.length !== 0) {
        // there is a sleeping consumer available, use it to run our task
        const consumer = this.consumerQueue.shift();
        // consumer here is the resolve function added to the this.consumerQueue by runTask
        consumer(taskWrapper);
      } else {
        // all consumers are busy, enqueue the task
        this.taskQueue.push(taskWrapper);
      }
    });
  }
}

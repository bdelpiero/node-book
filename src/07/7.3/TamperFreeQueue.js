class Queue {
  constructor() {
    this.messageQueue = [];
    this.pendingQueue = [];
  }

  enqueue(message) {
    if (this.pendingQueue.length !== 0) {
      // gets any pending promises pushed by dequeue (the queue is 'asleep')
      const consume = this.pendingQueue.shift();
      consume(message);
    } else {
      this.messageQueue.push(message);
    }
  }

  async dequeue() {
    return new Promise((resolve) => {
      if (this.messageQueue.length !== 0) {
        return resolve(this.messageQueue.shift());
      }
      // puts the queue to sleep (until resolve is called when a new task is added)
      this.pendingQueue.push(resolve);
    });
  }
}

class TamperFreeQueue {
  constructor(executor) {
    const internalQueue = new Queue();

    // make dequeue accessible to the client
    this.dequeue = internalQueue.dequeue.bind(internalQueue);

    // use revealing constructor pattern to give access to internal method on instance creation
    executor(internalQueue.enqueue.bind(internalQueue));
  }
}

export default TamperFreeQueue;

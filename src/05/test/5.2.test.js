import { jest } from "@jest/globals";
import { TaskQueue } from "../5.2";

describe("TaskQueue", () => {
  let queue;

  beforeEach(() => {
    queue = new TaskQueue(2);
  });

  test("should run tasks", async () => {
    const task1 = jest.fn().mockResolvedValue("Task 1");
    const task2 = jest.fn().mockResolvedValue("Task 2");

    const result1 = queue.runTask(task1);
    const result2 = queue.runTask(task2);

    await expect(result1).resolves.toEqual("Task 1");
    await expect(result2).resolves.toEqual("Task 2");
  });

  test("should respect concurrency limit", async () => {
    const task1 = jest.fn().mockResolvedValue("Task 1");
    const task2 = jest.fn().mockResolvedValue("Task 2");
    const task3 = jest.fn().mockResolvedValue("Task 3");

    queue.runTask(task1);
    queue.runTask(task2);
    queue.runTask(task3);

    expect(queue.running).toBeLessThanOrEqual(queue.concurrency);
  });

  test("should reject when task throws an error", async () => {
    const failingTask = jest.fn().mockImplementation(() => {
      throw new Error("Task error");
    });

    await expect(queue.runTask(failingTask)).rejects.toThrow("Task error");
  });
});

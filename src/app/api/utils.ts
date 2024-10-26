export class InMemoryQueue {
  private queue: (() => Promise<void>)[] = [];
  private processing = false;

  // Add a task to the queue and return a Promise that resolves when the task completes
  public enqueue(task: () => Promise<void>): Promise<void> {
    return new Promise((resolve, reject) => {
      const taskWrapper = async () => {
        try {
          await task();
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      this.queue.push(taskWrapper);
      this.processQueue();
    });
  }

  // Process the queue if it's not already being processed
  private async processQueue() {
    if (this.processing) return;

    this.processing = true;
    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        try {
          await task();
        } catch (error) {
          console.error("Error processing task:", error);
        }
      }
    }
    this.processing = false;
  }
}

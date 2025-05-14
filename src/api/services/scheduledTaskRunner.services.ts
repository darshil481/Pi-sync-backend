export class ScheduledTaskRunner {
  private readonly longDelay: number;
  private readonly task: () => Promise<void | boolean>;
  private timeout: NodeJS.Timeout | null = null;
  private isTaskRunning: boolean = false;

  constructor(runnerName: string, task: () => Promise<void | boolean>, longDelay: number, autoStart: boolean = true) {
    this.longDelay = longDelay;
    this.task = task;
    if (autoStart) {
      this.start();
    }
  }

  public async start(): Promise<void> {
    if (!this.isTaskRunning) {
      this.isTaskRunning = true;
      setTimeout(async () => {
        await this.runTask();
      }, 500); // Delay to start
    }
  }

  private async runTask(): Promise<void> {
    try {
      await this.task();
    } catch (error) {
      console.error(`Error in task: ${error}`);
    } finally {
      await this.scheduleNextRun();
    }
  }

  private async scheduleNextRun(): Promise<void> {
    if (this.isTaskRunning) {
      this.timeout = setTimeout(() => this.runTask(), this.longDelay);
    }
  }

  public stop(): void {
    this.isTaskRunning = false;
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
}

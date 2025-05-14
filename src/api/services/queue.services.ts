import { PrismaClient, Queue, QueueName } from "@prisma/client";

const prisma = new PrismaClient();

export class CustomQueue {
  async enqueue(queueName: QueueName, message: object): Promise<Queue> {
    return prisma.queue.create({
      data: { name: queueName, message },
    });
  }


  async dequeue(queueName: QueueName, length: number = 10, callback?: (messages: Queue[]) => Promise<boolean>): Promise<Queue[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const messages = await prisma.queue.findMany({
          where: { name: queueName },
          orderBy: { id: 'asc' },
          take: length,
        });
        const success = (await callback?.(messages)) ?? true;
        if (success)
          await prisma.queue.deleteMany({
            where: { id: { in: messages.map(job => job.id) }, name: queueName },
          });
        resolve(messages);
      } catch (error) {
        reject(error);
      }
    });
  }

  async peek(queueName: QueueName, length: number = 10): Promise<Queue[]> {
    return prisma.queue.findMany({
      where: { name: queueName },
      orderBy: { id: 'asc' },
      take: length,
    });
  }

  async remove(queueName: QueueName, jobIds: number[]): Promise<void> {
    await prisma.queue.deleteMany({
      where: { id: { in: jobIds }, name: queueName },
    });
  }

  async isEmpty(queueName: QueueName): Promise<boolean> {
    const count = await prisma.queue.count({
      where: { name: queueName },
    });
    return count <= 0;
  }

  async size(queueName: QueueName): Promise<number> {
    return prisma.queue.count({
      where: { name: queueName },
    });
  }

  async clear(queueName: QueueName): Promise<void> {
    await prisma.queue.deleteMany({
      where: { name: queueName },
    });
  }
}

export const customQueueInstance = (function () {
  let instance: CustomQueue;

  function createInstance() {
    const qInstance = new CustomQueue();
    return qInstance;
  }

  return {
    getInstance: function (): CustomQueue {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

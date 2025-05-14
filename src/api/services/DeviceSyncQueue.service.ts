import { PrismaClient, Queue, QueueName, SyncStatus } from "@prisma/client";
import { CustomQueue, customQueueInstance } from "./queue.services";
import { ERROR_MESSAGES } from "../../constants";
const prisma = new PrismaClient();

class DeviceSyncQueueService {
  private queueInstance: CustomQueue;
  constructor() {
    this.queueInstance = customQueueInstance.getInstance();
  }

  public async enqueueSyncEvent(deviceId: string): Promise<Queue> {
    return this.queueInstance.enqueue(QueueName.EVENT_SYNCING, { deviceId });
  }

  public async syncTaskRunner() {
    try {
      const successJobIds: number[] = [];
      const queueData = await this.queueInstance.peek("EVENT_SYNCING");

      for (const eventJob of queueData) {
        try {
          const msg = eventJob.message as { deviceId: string };
          const { deviceId } = msg;

          if (!deviceId) continue;

          const deviceInfo = await prisma.device.findFirst({
            where:{
              deviceId:deviceId
            }
          })

          if(!deviceInfo) continue;

          const isSuccess = Math.random() < 0.7; 


          if (isSuccess) {
            await prisma.device.update({
              where: { deviceId },
              data: {
                syncStatus: SyncStatus.Success,
                lastSync: new Date(),
              },
            });
          } else {
            const randomError =
              ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)];

            const device = await prisma.device.findFirst({
              where: { deviceId }
            });

            if (device) {
              await prisma.device.update({
                where: { deviceId },
                data: {
                  syncStatus: SyncStatus.Failed,
                  lastSync: new Date(),
                  syncErrors: {
                    create: {
                      message: randomError,
                    },
                  },
                },
              });
            }
          }

          successJobIds.push(eventJob.id);
        } catch (error) {
          console.error(`Error processing job ${eventJob.id}:`, error);
        }
      }

      if (successJobIds.length > 0) {
        await this.queueInstance.remove("EVENT_SYNCING", successJobIds);
      }

      const isQueueEmpty = await this.queueInstance.isEmpty("EVENT_SYNCING");
      return !isQueueEmpty;
    } catch (error) {
      console.log("🚀 ~ syncTaskRunner error:", error);
      return false;
    }
  }
}

export default DeviceSyncQueueService;

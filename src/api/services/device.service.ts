import { PrismaClient, SyncStatus } from "@prisma/client";
const prisma = new PrismaClient();

export class DeviceService {
  constructor() {
  }

  async getAllDevicesService(listData: { page: number; limit: number }) {
    const page = listData.page;
    const limit = listData.limit;

    const result = await Promise.all([
      prisma.device.count(),
      prisma.device.findMany({
        skip: page * limit,
        take: limit,
        orderBy: {
          lastSync: "desc",
        },
      }),
    ]);

    return {
      total: result[0] ?? 0,
      data: result[1],
    };
  }

  public async getDeviceInfoService(deviceId: string) {
    return prisma.device.findFirst({
      where: {
        deviceId,
      },
    });
  }

  public async updateDeviceService(data: {
    deviceId: string;
    lastSync: Date;
    syncStatus: SyncStatus;
  }) {
    return prisma.device.update({
      where: {
        deviceId: data.deviceId,
      },
      data,
    });
  }

  public async createDeviceService(data: {
    deviceId: string;
    lastSync: Date;
    syncStatus: SyncStatus;
  }) {
    return prisma.device.create({
      data: {
        deviceId: data.deviceId,
        lastSync: data.lastSync,
        syncStatus: data.syncStatus,
      },
    });
  }
}

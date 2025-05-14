import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ErrorLogService {
  constructor() {}

  async getAllErrorLogsService(listData: { page: number; limit: number }) {
    const page = listData.page;
    const limit = listData.limit;

    const result = await Promise.all([
      prisma.syncError.count(),
      prisma.syncError.findMany({
        skip: page * limit,
        take: limit,
        orderBy: {
          timestamp: "desc",
        },
      }),
    ]);

    return {
      total: result[0] ?? 0,
      data: result[1],
    };
  }

  async createErrorLogService(data: {
    deviceId: string;
    message: string;
    timestamp: Date;
  }) {
    return prisma.syncError.create({
      data: {
        deviceId: data.deviceId,
        message: data.message,
        timestamp: data.timestamp,
      },
    });
  }
}

export default ErrorLogService;

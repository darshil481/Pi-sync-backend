import { Request, Response, NextFunction } from "express";
import { generalResponse } from "../../helpers/common.helper";
import DeviceSyncQueueService from "../services/DeviceSyncQueue.service";
import { ScheduledTaskRunner } from "../services/scheduledTaskRunner.services";

class DeviceSyncController {
  ;

  constructor(private syncService: DeviceSyncQueueService) {
    new ScheduledTaskRunner("event_syncing",() => this.syncService.syncTaskRunner(), 1000);
  }


  public triggerSyncEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { deviceId } = req.body;

      if (!deviceId) {
        return generalResponse(res, null, "Missing deviceId", "error", true, 400);
      }


      const result = await this.syncService.enqueueSyncEvent(deviceId);

      return generalResponse(
        res,
        result,
        "Sync event added to queue successfully",
        "success",
        true,
        200
      );
    } catch (error) {
      console.error("Error triggering sync event:", error);
      return generalResponse(res, null, "Failed to enqueue sync", "error", true, 500);
    }
  };
}

export default DeviceSyncController;

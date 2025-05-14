import { Routes } from "./index.route";
import { Router } from 'express';
import multer from "multer";
import DeviceSyncController from "../controllets/deviceSyncController";
import DeviceSyncQueueService from "../services/DeviceSyncQueue.service";

const upload = multer();
class DeviceSyncroute{
public path = '/sync';
  public router = Router();
  public deviceSyncController = new DeviceSyncController(new DeviceSyncQueueService());
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/add-event`,
      upload.none(),
      this.deviceSyncController.triggerSyncEvent
    );
  }
}
export default DeviceSyncroute;
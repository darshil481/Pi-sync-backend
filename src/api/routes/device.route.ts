import validationMiddleware from "../../middlewares/validation.middleware";
import { ListSchema } from "../../validationSchemas/listing.schema";
import { DeviceController } from "../controllets/device.controller";
import { DeviceService } from "../services/device.service";
import { Routes } from "./index.route";
import { Router } from 'express';
import multer from "multer";

const upload = multer();
class DeviceRoute implements Routes {
  public path = '/device';
  public router = Router();
  public deviceController = new DeviceController(new DeviceService());
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/list`,
      upload.none(),
      validationMiddleware(ListSchema, 'body'),
      this.deviceController.getAllDevices
    );
  }
  
}


export default DeviceRoute;
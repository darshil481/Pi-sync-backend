import { Request, Response, NextFunction } from "express";
import { DeviceService } from "../services/device.service";
import { generalResponse } from "../../helpers/common.helper";
import { SyncStatus } from "@prisma/client";

export class DeviceController {
  

  constructor(private deviceService: DeviceService) {
  }

  public getAllDevices = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        page,
        limit
      } = req.body;
      const listData = {
        page: page ? Number(page) - 1 : 0,
        limit: limit ? Number(limit) : 10,
      };
      const result = await this.deviceService.getAllDevicesService(listData);
      return generalResponse(
        res,
        result,
        "Devices fetched successfully",
        "success",
        false,
        200
      );
    } catch (error) {
      console.error(error);
      return generalResponse(
        res,
        null,
        "An error occurred while retrieving devices",
        "error",
        true,
        500
      );
    }
  };

  public updateDeviceInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { deviceId, lastSync, syncStatus } = req.body;

      if (!deviceId) {
        return generalResponse(
          res,
          null,
          "Missing required deviceId",
          "error",
          true,
          400
        );
      }

      const device = await this.deviceService.getDeviceInfoService(deviceId);

      if (!device) {
        return generalResponse(
          res,
          null,
          "Device not found",
          "error",
          true,
          404
        );
      }

      const payload = {
        deviceId: deviceId,
        syncStatus: syncStatus ?? device?.syncStatus ?? SyncStatus.Pending,
        lastSync: lastSync
          ? new Date(lastSync)
          :  new Date(),
      };

      const result = await this.deviceService.updateDeviceService(payload);

      return generalResponse(
        res,
        result,
        "Device updated successfully",
        "success",
        true,
        200
      );
    } catch (error) {
      console.error(error);
      return generalResponse(
        res,
        null,
        "Error updating device",
        "error",
        true,
        500
      );
    }
  };

  public createDeviceInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { deviceId, lastSync, syncStatus } = req.body;

      if (!deviceId) {
        return generalResponse(
          res,
          null,
          "Missing required field: deviceId",
          "error",
          true,
          400
        );
      }

      const existingDevice = await this.deviceService.getDeviceInfoService(
        deviceId
      );
      if (existingDevice) {
        return generalResponse(
          res,
          null,
          "Device already exists",
          "error",
          true,
          409
        );
      }

      const result = await this.deviceService.createDeviceService({
        deviceId,
        lastSync: lastSync ? new Date(lastSync) : new Date(),
        syncStatus: syncStatus ?? SyncStatus.Pending,
      });

      return generalResponse(
        res,
        result,
        "Device created successfully",
        "success",
        true,
        201
      );
    } catch (error) {
      console.error(error);
      return generalResponse(
        res,
        null,
        "Error creating device",
        "error",
        true,
        500
      );
    }
  };
}

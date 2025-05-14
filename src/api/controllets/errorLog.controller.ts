import { Request, Response, NextFunction } from "express";
import ErrorLogService from "../services/errorLog.service";
import { generalResponse } from "../../helpers/common.helper";

class ErrorLogController {
  
  constructor(private errorLogService: ErrorLogService) {
  }
  public getAllErrorLogs = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { page, limit } = req.body;
      const listData = {
        page: page ? Number(page) - 1 : 0,
        limit: limit ? Number(limit) : 10,
      };
      const result = await this.errorLogService.getAllErrorLogsService(listData);
      return generalResponse(
        res,
        result,
        "error logs fetched successfully",
        "success",
        false,
        200
      );
    } catch (error) {
      console.error(error);
      return generalResponse(
        res,
        null,
        "An error occurred while retrieving error logs",
        "error",
        true,
        500
      );
    }
  };

   public createErrorLog = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { deviceId, message, timestamp } = req.body;

      if (!deviceId || !message) {
        return generalResponse(res, null, "deviceId and message are required", "error", false, 400);
      }

      const result = await this.errorLogService.createErrorLogService({
        deviceId,
        message,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
      });

      return generalResponse(res, result, "Error log created successfully", "success", false, 201);
    } catch (error) {
      console.error(error);
      return generalResponse(res, null, "Error while creating error log", "error", false, 500);
    }
  };
}
export default ErrorLogController;

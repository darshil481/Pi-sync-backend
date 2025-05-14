import { Router } from "express";
import ErrorLogController from "../controllets/errorLog.controller";
import { Routes } from "./index.route";
import multer from "multer";
import ErrorLogService from "../services/errorLog.service";
import validationMiddleware from "../../middlewares/validation.middleware";
import { ListSchema } from "../../validationSchemas/listing.schema";

const upload = multer();

class ErrorLogRoute implements Routes {
  public path = "/error";
  public router = Router();
  public errorLogController = new ErrorLogController(new ErrorLogService());
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/list`,
      upload.none(),
      validationMiddleware(ListSchema, 'body'),
      this.errorLogController.getAllErrorLogs
    );
  }
}
export default ErrorLogRoute;

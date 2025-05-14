import express from "express";
import { PORT } from "./config/env.config";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.middleware";
import validateEnv from "./utils/validateEnv";
import http from "http";
import IndexRoute from "./api/routes/index.route";
import bodyParser from "body-parser";

class App {
  public app: express.Application;
  public server: http.Server;
  public port: string | number;
  private routes = new IndexRoute();

  constructor() {
    validateEnv(); // Validate .env vars

    this.app = express();
    this.server = http.createServer(this.app);
    this.port = PORT || 4000;

    this.initializeMiddlewares();
    this.initializeRoutes(); 
    this.initializeErrorHandling();

    this.app.use("/", express.static("public")); 
  }

  public listen() {
    this.server.listen(this.port, () => {
      console.log(`=================================`);
      console.log(`🚀 App listening on port ${this.port}`);
      console.log(`=================================`);
    });
  }

  private initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes() {
    this.app.get("/", (req, res) => {
      res.send("OK");
    });

    this.app.use("/", this.routes.router);
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;

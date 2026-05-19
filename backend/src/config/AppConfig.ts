import cookieParser from "cookie-parser";
import express, { type Express } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import helmet from "helmet";
import type { Server } from "http";
import { CorsError } from "../exceptions/AppError.js";
import { errorHandler } from "../middlewares/ErrorMiddleware.js";
import path from "node:path";
import fs from "node:fs";
import type { AuthController } from "../controllers/AuthController.js";
import rateLimit from "express-rate-limit";

export class AppConfig {
  private app: Express;
  private port: number;
  private host: string;
  private server?: Server;
  private swaggerDocument: any;

  constructor(private authController: AuthController) {
    this.app = express();
    this.port = process.env.BACKEND_PORT
      ? parseInt(process.env.BACKEND_PORT as string)
      : 3000;
    this.host = process.env.BACKEND_HOST || "0.0.0.0";

    this.swaggerDocument = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), "./swagger.json"), "utf8"),
    );

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 2000,
    });
    // Confiance au proxy 
    this.app.set('trust proxy', 1);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: (origin, callback) => {
          const allowed = [
            "http://localhost:4200",
            "http://localhost:4000",
            undefined,
          ];
          if (!origin || allowed.includes(origin)) {
            callback(null, true);
          } else {
            callback(new CorsError());
          }
        },
        credentials: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        allowedHeaders: ["Content-Type", "Authorization", "X-XSRF-TOKEN"],
        exposedHeaders: ["X-XSRF-TOKEN"],
      }),
    );
    this.app.use(limiter);
    this.app.use(cookieParser());
  }

  private initializeRoutes() {
    const authLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 10,
    });
    this.app.get("/api", (req, res) => {
      res.json({ message: "Hello les Eclaireurs !" });
    });
    this.app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(this.swaggerDocument),
    );
    this.app.use("/auth", authLimiter, this.authController.getRouter());
  }

  private initializeErrorHandling() {
    this.app.use(errorHandler);
  }

  public listen() {
    this.server = this.app.listen(this.port, this.host, () => {
      console.log(`Server started on http://${this.host}:${this.port}`);
    });
  }

  public getApp(): Express {
    return this.app;
  }
}

import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import cookieParser from "cookie-parser";
import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import type { Server } from "http";

export class AppConfig {
  private app: Express;
  private port: number;
  private host: string;
  private server?: Server;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.BACKEND_PORT as string) || 3000;
    this.host = process.env.BACKEND_HOST || "0.0.0.0";

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: (origin, callback) => {
          // Ports of communicate Front-End
          const allowed = [
            "http://localhost:4200",
            "http://localhost:4000",
            undefined,
          ];
          if (!origin || allowed.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"));
          }
        },
        credentials: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        allowedHeaders: ["Content-Type", "Authorization", "X-XSRF-TOKEN"],
        exposedHeaders: ["X-XSRF-TOKEN"],
      }),
    );
    this.app.use(cookieParser());
  }

  private initializeRoutes() {
    this.app.get("/api", (req, res) => {
      res.json({ message: "Hello les Eclaireurs !" });
    });
  }

  private initializeErrorHandling() {}

  public listen() {
    this.server = this.app.listen(this.port, this.host, () => {
      console.log(`Server started on http://${this.host}:${this.port}`);
    });
  }

  public getApp(): Express {
    return this.app;
  }
}

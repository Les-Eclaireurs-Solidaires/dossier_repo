import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import "reflect-metadata";
import { AppConfig } from "./config/AppConfig.js";

const appConfig: AppConfig = new AppConfig();
appConfig.listen();

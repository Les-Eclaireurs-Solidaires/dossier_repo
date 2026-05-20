import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import { AppConfig } from "./config/AppConfig.js";
import { UserRepository } from "./repositories/UserRepository.js";
import { HashService } from "./services/HashService.js";
import { TokenService } from "./services/TokenService.js";
import type { Pool } from "mysql2/promise";
import { Database } from "./config/DatabaseConfig.js";
import { AuthService } from "./services/AuthService.js";
import { AuthController } from "./controllers/AuthController.js";

const database: Pool = Database.getInstance().getPool();

const userRepository = new UserRepository(database);
const hashService = new HashService();
const tokenService = new TokenService();

const authService = new AuthService(userRepository, hashService, tokenService);
const authController = new AuthController(authService, tokenService)
const appConfig: AppConfig = new AppConfig(
    authController
);
appConfig.listen();

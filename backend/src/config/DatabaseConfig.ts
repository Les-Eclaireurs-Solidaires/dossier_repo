
import mysql, { PoolConnection, type Pool, type PoolOptions } from "mysql2/promise";
import { EnvironmentVariableError } from "./AppError.js";

export class Database {
  private static instance: Database;
  private pool: Pool;

  private constructor() {
    const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

    if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
      throw new EnvironmentVariableError("FATAL ERROR: Variables d'environnement de base de données manquantes dans le fichier .env !");
    }
    const access: PoolOptions = {
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };

    this.pool = mysql.createPool(access);
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async disconnect(): Promise<void> {
    await this.pool.end();
  }
  public getPool(): Pool {
    return this.pool;
  }
  public async getConnection(): Promise<PoolConnection> {
    return await this.pool.getConnection();
  }

}
